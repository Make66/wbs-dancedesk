import { Router } from 'express';
import { authenticate, validateZod } from '#middlewares';
import { getSettings, upsertSettings } from '#controllers';
import { settingsSchema } from '#schemas';

const settingsInputSchema = settingsSchema.omit({ id: true, tenantId: true });

const settingsRouter = Router();

settingsRouter
  .route('/')
  .get(authenticate, getSettings)
  .put(authenticate, validateZod(settingsInputSchema), upsertSettings)
  .patch(authenticate, validateZod(settingsInputSchema.partial()), upsertSettings);

export default settingsRouter;
