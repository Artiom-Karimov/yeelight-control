import { isIPv4 } from 'node:net';

export class ValueParser {
  private constructor() {
    return;
  }

  public static ip(value: unknown): string {
    if (typeof value === 'string' && isIPv4(value)) return value;
    throw new Error(`Wrong IP format: ${value}`);
  }

  public static port(value: unknown): number {
    let port: number;

    if (typeof value === 'number') port = value;
    else if (typeof value === 'string') port = +value;
    else throw new Error('Wrong port datatype');

    if (isNaN(port)) throw new Error(`Wrong port format: ${value}`);
    if (port < 1 || port > 65535) throw new Error('Port must be 1-65535');
    if (port % 1 !== 0) throw new Error('Port must be an integer');

    return port;
  }
}
