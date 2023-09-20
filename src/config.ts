import { LocalNetwork } from './utils/local-network';
import { SetupParser } from './utils/setup-value-parser';

export type ConfigParams = {
  /** Device control interface TCP port. Defaults to 55443 */
  controlPort: number;
  /** Multicast port. Defaults to 1982 */
  discoveryPort: number;
  /** Multicast address. Defaults to 239.255.255.250 */
  discoveryIp: string;
  /** Local machine IP. Defaults to first found interface */
  discoveryHost: string;
  /** Reconnect timeout in ms */
  socketReconnect: number;
  /** Command will be removed from queue after this timeout (milliseconds) */
  commandExpire: number;
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
      controlPort: this.getControlPort(params),
      discoveryPort: this.getDiscoveryPort(params),
      discoveryIp: this.getAddress(params),
      discoveryHost: this.getHost(params),
      socketReconnect: this.getReconnect(params),
      commandExpire: this.getExpire(params),
    };
  }

  public get<T>(key: keyof ConfigParams): T {
    return this._state[key] as T;
  }

  private getControlPort({ controlPort: port }: Partial<ConfigParams>): number {
    if (port == null) return defaults.controlPort;
    return SetupParser.port(port);
  }

  private getDiscoveryPort({
    discoveryPort: port,
  }: Partial<ConfigParams>): number {
    if (port == null) return defaults.discoveryPort;
    return SetupParser.port(port);
  }

  private getAddress({ discoveryIp: ip }: Partial<ConfigParams>): string {
    if (ip == null) return defaults.discoveryIp;
    return SetupParser.ip(ip);
  }

  private getHost({ discoveryHost: ip }: Partial<ConfigParams>): string {
    if (ip == null) return this.getLocalhost();
    return SetupParser.ip(ip);
  }

  private getLocalhost(): string {
    const localhost = LocalNetwork.getLocalIp();
    return localhost || defaults.discoveryHost;
  }

  private getReconnect({ socketReconnect }: Partial<ConfigParams>): number {
    if (socketReconnect == null) return defaults.socketReconnect;
    if (typeof socketReconnect === 'number' && socketReconnect >= 0)
      return socketReconnect;
    throw new Error(`Invalid reconnect interval: ${socketReconnect}`);
  }

  private getExpire({ commandExpire }: Partial<ConfigParams>): number {
    if (commandExpire == null) return defaults.commandExpire;
    return SetupParser.timeout(commandExpire);
  }
}

const defaults: ConfigParams = {
  controlPort: 55443,
  discoveryPort: 1982,
  discoveryIp: '239.255.255.250',
  discoveryHost: '0.0.0.0',
  socketReconnect: 5000,
  commandExpire: 5000,
};
