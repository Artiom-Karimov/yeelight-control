export class ExponentialBackoff {
  private timeout = 0;
  private timer?: NodeJS.Timeout;

  constructor(private readonly maxTimeout = 60_000) {
    this.reset();
  }

  reset(): void {
    this.timeout = 30;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }

  delayNext(cb: () => void): void {
    this.timer = setTimeout(() => {
      this.timer = undefined;
      cb();
    }, this.timeout);
    this.timeout *= 2;
    if (this.timeout > this.maxTimeout) this.timeout = this.maxTimeout;
  }
}
