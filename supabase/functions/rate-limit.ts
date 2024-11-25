interface RateLimitData {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
}

export class RateLimiter {
  private static readonly RATE_LIMIT_DURATION = 3600000; // 1 hour in ms
  private static readonly MAX_ATTEMPTS = 5;
  private static readonly MIN_DELAY = 1000; // 1 second
  
  private rateLimitStore: Map<string, RateLimitData> = new Map();

  checkRateLimit(ipAddress: string): { allowed: boolean; waitTime: number } {
    const now = Date.now();
    const data = this.rateLimitStore.get(ipAddress) || {
      count: 0,
      firstAttempt: now,
      lastAttempt: now
    };

    // Clean up old entries
    if (now - data.firstAttempt > this.RATE_LIMIT_DURATION) {
      data.count = 0;
      data.firstAttempt = now;
    }

    // Calculate progressive delay
    const attemptDelay = Math.pow(2, data.count) * this.MIN_DELAY;
    const timeElapsed = now - data.lastAttempt;
    
    if (data.count >= this.MAX_ATTEMPTS && timeElapsed < this.RATE_LIMIT_DURATION) {
      return { 
        allowed: false, 
        waitTime: this.RATE_LIMIT_DURATION - timeElapsed 
      };
    }

    if (timeElapsed < attemptDelay) {
      return { 
        allowed: false, 
        waitTime: attemptDelay - timeElapsed 
      };
    }

    // Update rate limit data
    data.count++;
    data.lastAttempt = now;
    this.rateLimitStore.set(ipAddress, data);

    return { allowed: true, waitTime: 0 };
  }
} 