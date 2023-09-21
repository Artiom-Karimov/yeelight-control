import { EventEmitter } from 'events';
import { Config } from '../config';
import { DiscoveryData } from '../discovery/discovery-data';
import { SetupParser } from '../utils/setup-value-parser';
import { TelnetClient, TelnetEvent } from '../utils/telnet-client';
import { CommandCache } from './command-cache';
import { DeviceState } from './dto/device-state';
import { Notification } from './commands/notification';
import { TelnetResponse } from './commands/response';

export class Device {
  private _id?: number;
  private _state: DeviceState = {};
  private readonly _ip: string;
  private readonly _port: number;

  private readonly commands: CommandCache;
  private readonly client: TelnetClient;
  private readonly emitter = new EventEmitter();

  constructor(config: Config, ip: string, port: number | undefined) {
    this._ip = SetupParser.ip(ip);
    this._port = port
      ? SetupParser.port(port)
      : config.get<number>('controlPort');

    this.commands = new CommandCache(config);
    this.client = new TelnetClient(this._ip, this._port, true);
    this.setupClient();
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

  private setupClient(): void {
    this.client
      .connect()
      .on(TelnetEvent.connect, this.onConnect)
      .on(TelnetEvent.data, this.onData)
      .on(TelnetEvent.close, this.onClose)
      .on(TelnetEvent.error, this.onError);
  }

  private onConnect = () => {
    this.emitter.emit('connect');
  };

  private onData = (data: string) => {
    if (this.tryParseNotification(data)) return;
    if (this.tryParseResponse(data)) return;
    this.emitter.emit('warning', `Unrecognized response: ${data}`);
  };

  private onError = (err: NodeJS.ErrnoException) => {
    this.emitter.emit('warning', `Socket error: ${err.code}`);
  };

  private onClose = () => {
    this.emitter.emit('warning', `Socket disconnected`);
  };

  private tryParseNotification(data: string): boolean {
    try {
      const notification = new Notification(data);
      this.update(notification.state);
      return true;
    } catch (err) {
      return false;
    }
  }

  private tryParseResponse(data: string): boolean {
    try {
      const response = new TelnetResponse(data);
      this.commands.response(response);
      return true;
    } catch (error) {
      return false;
    }
  }
}
