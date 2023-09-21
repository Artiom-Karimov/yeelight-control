import { Config } from '../../config';
import { Command } from './command';
import { Response } from './response';

export class CommandCache {
  private readonly list = new Array<Command>();
  private readonly timeout: number;

  constructor(config: Config) {
    this.timeout = config.get<number>('commandExpire');
  }

  public add(command: Command): void {
    this.list.push(command);
    this.flushExpired();
  }

  public response(response: Response): void {
    for (let i = 0; i < this.list.length; i++) {
      const command = this.list[i];
      if (command.response(response)) {
        this.list.splice(i, 1);
        return;
      }
    }
  }

  private flushExpired(): void {
    let lastExpired = -1;

    for (let i = 0; i < this.list.length; i++) {
      const expires = this.list[i].createdAt.getTime() + this.timeout;
      if (expires > Date.now()) break;
      lastExpired = i;
    }

    if (lastExpired < 0) return;
    this.list.splice(0, lastExpired + 1);
  }
}
