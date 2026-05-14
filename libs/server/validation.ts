import { z } from 'zod';

export const walletAddressSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'A valid wallet address is required.');

export const transactionHashSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{64}$/, 'A valid transaction hash is required.');

export const countSchema = z.coerce.number().int().min(1).max(100).default(20);

export function parseSearchParams<T>(
  schema: z.ZodType<T>,
  searchParams: URLSearchParams,
) {
  return schema.parse(Object.fromEntries(searchParams.entries()));
}
