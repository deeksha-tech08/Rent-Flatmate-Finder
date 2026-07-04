# System Design Write-up — Rent & Flatmate Finder

## Compatibility Scoring Design
Each tenant profile (preferred location, budget range, move-in date) is matched against room listings (location, rent, availability). When a tenant views listings, the system checks whether a score already exists for that tenant-listing pair in the database. If not, it computes one and stores it — the score is never recalculated on every request, since scores don't change unless the underlying profile or listing changes. This keeps browsing fast and avoids redundant LLM calls.

## LLM Integration and Fallback
The scoring service sends the tenant profile and listing details to an LLM with a fixed prompt asking for a 0–100 score and a short explanation, returned as JSON. The response is parsed and validated before storage; if the LLM call fails (timeout, rate limit, invalid response), the system automatically falls back to a rule-based scorer. The rule-based scorer computes a weighted score from budget overlap (how much the listing's rent falls within the tenant's stated range) and location match (exact vs. nearby vs. no match), producing a comparable 0–100 score with a templated explanation. This ensures the ranking feature never breaks even if the LLM provider is down.

## Chat Implementation
Once an owner accepts a tenant's interest request, both parties are placed in a shared chat room identified by the interest/connection ID. Real-time messaging uses WebSockets (Socket.IO): on connection, the server authenticates the socket using the same JWT used for REST calls, then verifies the user is actually a participant in that chat room before allowing them to join or send messages. Every message is persisted to the database immediately on send, so chat history survives reconnects and is available via a REST endpoint for initial load. Typing indicators and read receipts are handled as lightweight, non-persisted socket events layered on top of the persisted message flow.

## Notification Flow
Two key events trigger emails: (1) when a tenant with a high compatibility score (above a threshold) expresses interest in a listing, the owner is notified so they don't miss a strong match; (2) when an owner accepts or declines an interest, the tenant is notified of the outcome. Both are sent asynchronously after the triggering database write completes, so a slow or failing email provider never blocks the core user action (expressing interest, accepting/declining). Notification failures are logged but don't roll back the underlying state change.
