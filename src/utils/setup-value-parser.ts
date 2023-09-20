import { isIPv4 } from 'node:net';
import { Constants } from '../constants';

export class SetupParser {
  private constructor() {
    return;
  }

  public static ip(value: unknown): string {
    if (typeof value === 'string' && isIPv4(value)) return value;
    throw new Error(`Wrong IP format: ${value}`);
  }

  public static port(value: unknown): number {
    const port = SetupParser.parseInt(value, 'port');
    if (port < 1 || port > 65535) throw new Error('Port must be 1-65535');

    return port;
  }

  public static timeout(value: unknown): number {
    let timeout = SetupParser.parseInt(value, 'timeout');
    if (timeout < Constants.minTimeout) timeout = Constants.minTimeout;
    if (timeout > Constants.maxTimeout) timeout = Constants.maxTimeout;
    return timeout;
  }

  private static parseInt(value: unknown, name: string): number {
    let result: number;

    if (typeof value === 'number') result = value;
    else if (typeof value === 'string') result = +value;
    else throw new Error('Wrong ${name} datatype');

    if (isNaN(result)) throw new Error(`Wrong ${name} format: ${value}`);
    if (result % 1 !== 0) throw new Error(`${name} must be an integer`);

    return result;
  }
}
