import { Config } from '../config';
import { Command } from './commands/command';

export class CommandCache {
  private readonly list = new Array<Command>();
  private readonly timeout: number;

  constructor(config: Config) {
    this.timeout = config.get('commandExpire') as number;
  }
  public add(command: Command): void {
    this.list.push(command);
    this.flushExpired();
  }
  // TODO: response (find command by id, pass response)

  private flushExpired(): void {
    for (let i = 0; i < this.list.length; i++) {
      const expires = this.list[i].createdAt.getTime() + this.timeout;
      if (expires > Date.now()) continue;

      this.list.splice(i, 1);
      i--;
    }
  }
}
