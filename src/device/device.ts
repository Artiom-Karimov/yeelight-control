import { Config } from '../config';
import { DiscoveryData } from '../discovery/discovery-data';
import { ValueParser } from '../utils/value-parser';
import { CommandCache } from './command-cache';
import { DeviceState } from './device-state';

export class Device {
  private _id?: number;
  private _state: DeviceState = {};
  private readonly _ip: string;
  private readonly _port: number;

  private readonly commands: CommandCache;

  constructor(config: Config, ip: string, port: number | undefined) {
    this._ip = ValueParser.ip(ip);
    this._port = port
      ? ValueParser.port(port)
      : config.get<number>('controlPort');

    this.commands = new CommandCache(config);
  }
  public static fromDiscovery(config: Config, data: DiscoveryData): Device {
    const device = new Device(config, data.ip, data.port);
    device._id = data.id;
    device._state = data.getState();

    return device;
  }

  get id(): number | undefined {
    return this._id;
  }
  get state(): DeviceState {
    return { ...this._state };
  }
  get ip(): string {
    return this._ip;
  }
}
