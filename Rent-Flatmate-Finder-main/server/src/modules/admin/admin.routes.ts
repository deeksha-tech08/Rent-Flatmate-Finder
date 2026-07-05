import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.middleware';
import { adminController } from './admin.controller';

const router = Router();

router.use(authenticate, authorize('ADMIN'));

router.get('/users', adminController.getUsers);
router.get('/listings', adminController.getListings);
router.patch('/listings/:id/deactivate', adminController.deactivateListing);
router.get('/activity', adminController.getActivity);

export default router;