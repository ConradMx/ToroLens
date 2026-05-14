export type ToronetErrorKind =
  | 'validation'
  | 'timeout'
  | 'upstream'
  | 'unsupported'
  | 'rate_limited'
  | 'unknown';

export class ToronetError extends Error {
  readonly kind: ToronetErrorKind;
  readonly status: number;
  readonly cause?: unknown;

  constructor({
    message,
    kind,
    status,
    cause,
  }: {
    message: string;
    kind: ToronetErrorKind;
    status: number;
    cause?: unknown;
  }) {
    super(message);
    this.name = 'ToronetError';
    this.kind = kind;
    this.status = status;
    this.cause = cause;
  }
}

export function classifyToronetError(error: unknown): ToronetError {
  if (error instanceof ToronetError) {
    return error;
  }

  if (error instanceof Error && error.name === 'TimeoutError') {
    return new ToronetError({
      kind: 'timeout',
      status: 504,
      message: 'Toronet did not respond before the request timed out.',
      cause: error,
    });
  }

  const message =
    error instanceof Error && error.message
      ? error.message
      : 'Toronet returned an unexpected response.';

  return new ToronetError({
    kind: 'upstream',
    status: 502,
    message,
    cause: error,
  });
}

export function publicToronetError(error: unknown) {
  const toronetError = classifyToronetError(error);

  return {
    status: toronetError.status,
    body: {
      error: toronetError.message,
      code: toronetError.kind,
    },
  };
}

type ExplainTransactionFailureInput = {
  status: 'success' | 'pending' | 'failed' | 'unknown';
  from?: string;
  to?: string;
  rawError?: string;
  revertReason?: string;
};

export function explainTransactionFailure({
  status,
  from,
  to,
  rawError,
  revertReason,
}: ExplainTransactionFailureInput): string {
  if (status !== 'failed') {
    return 'This transaction does not currently show a failure state.';
  }

  const combinedText = `${rawError ?? ''} ${revertReason ?? ''}`.toLowerCase();

  if (from && to && from === to) {
    return 'This looks like a self-transfer. That type of transaction may not be allowed in this flow.';
  }

  if (
    combinedText.includes('insufficient') ||
    combinedText.includes('balance too low')
  ) {
    return 'The wallet may not have had enough balance to complete this transaction.';
  }

  if (
    combinedText.includes('invalid address') ||
    combinedText.includes('bad address')
  ) {
    return 'The destination address may be invalid or unsupported.';
  }

  if (
    combinedText.includes('unauthorized') ||
    combinedText.includes('forbidden') ||
    combinedText.includes('permission')
  ) {
    return 'This action may require extra permission or account eligibility.';
  }

  if (revertReason) {
    return `The transaction failed with this reported reason: ${revertReason}`;
  }

  if (rawError) {
    return `The transaction failed and returned this error: ${rawError}`;
  }

  return 'The transaction failed, but no detailed failure reason was returned.';
}
