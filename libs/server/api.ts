import { ZodError } from 'zod';
import { publicToronetError, ToronetError } from '@/libs/toronet/errors';

export function apiErrorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return Response.json(
      {
        error: error.issues[0]?.message ?? 'Invalid request.',
        code: 'validation',
      },
      { status: 400 },
    );
  }

  if (error instanceof ToronetError) {
    return Response.json(
      { error: error.message, code: error.kind },
      { status: error.status },
    );
  }

  const { body, status } = publicToronetError(error);
  return Response.json(body, { status });
}
