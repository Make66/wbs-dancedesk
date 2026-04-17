import type { RequestHandler } from 'express';
import prisma from '#db';

const authenticatePublic: RequestHandler = async (req, _res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] as string | undefined;
    if (!apiKey) throw new Error('Missing API key', { cause: { status: 401 } });

    const customer = await prisma.customer.findUnique({
      where: { apiKey },
      select: { id: true, tenantId: true, isActive: true, isDeleted: true }
    });

    if (!customer || !customer.isActive || customer.isDeleted) {
      throw new Error('Invalid API key', { cause: { status: 401 } });
    }

    req.publicTenant = { tenantId: customer.tenantId, customerId: customer.id };
    next();
  } catch (error) {
    next(error);
  }
};

export default authenticatePublic;
