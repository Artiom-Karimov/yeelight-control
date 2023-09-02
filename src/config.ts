import { isIPv4 } from 'node:net';
import { LocalNetwork } from './utils/local-network';

export type ConfigParams = {
  /** Multicast port. Defaults to 1982 */
  discoveryPort: number;
  /** Multicast address. Defaults to 239.255.255.250 */
  discoveryIp: string;
  /** Local machine IP. Defaults to first found interface */
  discoveryHost: string;
};

export class Config {
  private _state: ConfigParams;

  constructor(params?: Partial<ConfigParams>) {
    if (!params) {
      this._state = {
        ...defaults,
        discoveryHost: this.getLocalhost(),
      };
      return;
    }

    this._state = {
      discoveryPort: this.getPort(params),
      discoveryIp: this.getAddress(params),
      discoveryHost: this.getHost(params),
    };
  }

  get discoveryPort(): number {
    return this._state.discoveryPort;
  }
  get discoveryIp(): string {
    return this._state.discoveryIp;
  }
  get discoveryHost(): string {
    return this._state.discoveryHost;
  }

  private getPort({ discoveryPort: port }: Partial<ConfigParams>): number {
    if (port == null) return defaults.discoveryPort;
    if (this.validatePort(port)) return port;
    throw new Error(`Wrong discoveryPort: ${port}`);
  }

  private validatePort(value: unknown): value is number {
    if (typeof value !== 'number') return false;
    if (value % 1 !== 0) return false;
    return value > 0 && value < 65536;
  }

  private getAddress({ discoveryIp: ip }: Partial<ConfigParams>): string {
    if (ip == null) return defaults.discoveryIp;
    if (isIPv4(ip)) return ip;
    throw new Error(`Wrong discoveryIP format: ${ip}`);
  }

  private getHost({ discoveryHost: ip }: Partial<ConfigParams>): string {
    if (ip == null) return this.getLocalhost();
    if (isIPv4(ip)) return ip;
    throw new Error(`Wrong discoveryHost: ${ip}`);
  }

  private getLocalhost(): string {
    const localhost = LocalNetwork.getLocalIp();
    return localhost || defaults.discoveryHost;
  }
}

const defaults: ConfigParams = {
  discoveryPort: 1982,
  discoveryIp: '239.255.255.250',
  discoveryHost: '0.0.0.0',
};
