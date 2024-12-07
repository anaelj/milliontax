const DEFAULT_RETRY_COUNT = 3;
const INITIAL_RETRY_DELAY = 1000;

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    retryCount?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {}
): Promise<T> {
  const { retryCount = DEFAULT_RETRY_COUNT, onRetry } = options;
  let lastError: Error;

  for (let attempt = 0; attempt < retryCount; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (onRetry) {
        onRetry(lastError, attempt + 1);
      }

      if (attempt < retryCount - 1) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}