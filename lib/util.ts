export const throwIfError = <T>(e: T | Error): T => {
  if (e instanceof Error) throw e;
  return e;
};

export const toError = (error: unknown) => (error instanceof Error ? error : new Error(`Invalid Error type: ${error}`));
