import * as z from 'zod';
import type { Prisma } from '../../../../../generated/prisma/client';
import { RoomSelectObjectSchema as RoomSelectObjectSchema } from './RoomSelect.schema'

const makeSchema = () => z.object({
  select: z.lazy(() => RoomSelectObjectSchema).optional()
}).strict();
export const RoomArgsObjectSchema = makeSchema();
export const RoomArgsObjectZodSchema = makeSchema();
