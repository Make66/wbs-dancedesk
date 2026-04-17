import type { RequestHandler } from 'express';
import prisma from '#db';
import { log } from '#utils';

const SRC = 'middlewares/authenticatePublic';
const authenticatePublic: RequestHandler = async (req, _res, next) => {
  try {
    const apiKey = req.headers['x-api-key'] as string | undefined;
    log(SRC, 'authenticatePublic', 'Try public authentication for API key ', { apiKey: apiKey ? '***' + apiKey.slice(-6) : 'none'  });

    if (!apiKey) throw new Error('Missing API key', { cause: { status: 401 } });

    const customer = await prisma.customer.findUnique({
      where: { apiKey },
      select: { id: true, tenantId: true, isActive: true, isDeleted: true }
    });

    if (!customer || !customer.isActive || customer.isDeleted) {
      log(SRC, 'authenticatePublic', 'Invalid API key', { apiKey: apiKey ? '***' + apiKey.slice(-6) : 'none' });  
      throw new Error('Invalid API key', { cause: { status: 401 } });
    }
    log(SRC, 'authenticatePublic', 'Public authentication successful', { apiKey: apiKey ? '***' + apiKey.slice(-6) : 'none', customerId: customer.id, tenantId: customer.tenantId });
    req.publicTenant = { tenantId: customer.tenantId, customerId: customer.id };
    next();
  } catch (error) {
    log(SRC, 'authenticatePublic', 'Public authentication error', { error: (error as Error).message });
    next(error);
  }
};

export default authenticatePublic;
