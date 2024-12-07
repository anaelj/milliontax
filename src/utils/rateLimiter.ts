import { useState } from "react";

const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS = 6; // Maximum requests per minute

interface RequestLog {
  timestamp: number;
}

class RateLimiter {
  private requests: RequestLog[] = [];

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(
      (request) => now - request.timestamp < RATE_LIMIT_WINDOW
    );
    return this.requests.length < MAX_REQUESTS;
  }

  logRequest(): void {
    this.requests.push({ timestamp: Date.now() });
  }

  getTimeUntilNextWindow(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    return RATE_LIMIT_WINDOW - (Date.now() - oldestRequest.timestamp);
  }
}

export const rateLimiter = new RateLimiter();

export function useRateLimiter() {
  const [isWaiting, setIsWaiting] = useState(false);

  const waitForNextWindow = async (): Promise<void> => {
    const waitTime = rateLimiter.getTimeUntilNextWindow();
    if (waitTime > 0) {
      setIsWaiting(true);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
      setIsWaiting(false);
    }
  };

  return {
    isWaiting,
    waitForNextWindow,
  };
}
