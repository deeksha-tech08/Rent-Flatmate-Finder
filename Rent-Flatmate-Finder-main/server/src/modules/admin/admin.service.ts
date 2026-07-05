import prisma from '../../utils/prisma';

export class AdminService {
  async getAllUsers() {
    return prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllListings() {
    return prisma.listing.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { name: true, email: true } } },
    });
  }

  async deactivateListing(listingId: string) {
    return prisma.listing.update({
      where: { id: listingId },
      data: { status: 'FILLED' },
    });
  }

  async getActivityLogs() {
    return prisma.adminLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
}

export const adminService = new AdminService();