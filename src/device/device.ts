import { Config } from '../config';
import { DiscoveryData } from '../discovery/discovery-data';
import { SetupParser } from '../utils/setup-value-parser';
import { CommandCache } from './command-cache';
import { DeviceState } from './dto/device-state';

export class Device {
  private _id?: number;
  private _state: DeviceState = {};
  private readonly _ip: string;
  private readonly _port: number;

  private readonly commands: CommandCache;

  constructor(config: Config, ip: string, port: number | undefined) {
    this._ip = SetupParser.ip(ip);
    this._port = port
      ? SetupParser.port(port)
      : config.get<number>('controlPort');

    this.commands = new CommandCache(config);
  }
  public static fromDiscovery(config: Config, data: DiscoveryData): Device {
    const device = new Device(config, data.ip, data.port);
    const state = data.getState();
    device._id = state.id;
    device._state = state;

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
  get port(): number {
    return this._port;
  }

  update(data: DeviceState): void {
    this._state = {
      ...this._state,
      ...data,
    };
  }
}
