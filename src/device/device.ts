import { EventEmitter } from 'events';
import { Config } from '../config';
import { DiscoveryData } from '../discovery/discovery-data';
import { SetupParser } from '../utils/setup-value-parser';
import { TelnetClient, TelnetEvent } from '../utils/telnet-client';
import { CommandCache } from './commands/command-cache';
import { DeviceState } from './dto/device-state';
import { Notification } from './commands/notification';
import { TelnetResponse } from './commands/response';
import { ToggleCommand } from './commands/implementations/toggle.command';
import { Command } from './commands/command';
import { GetPropCommand } from './commands/implementations/get-prop.command';
import { Param } from './enums/param';
import { Constants } from '../constants';

export enum DeviceEvent {
  warning = 'warning',
  update = 'update',
  connect = 'connect',
  disconnect = 'disconnect',
  debug = 'debug',
}

export interface Device {
  get id(): number | undefined;
  get state(): DeviceState;
  get ip(): string;
  get port(): number;

  on(event: DeviceEvent.warning, cb: (message: string) => void): Device;
  on(event: DeviceEvent.update, cb: (state: DeviceState) => void): Device;
  on(event: DeviceEvent.connect, cb: () => void): Device;
  on(event: DeviceEvent.disconnect, cb: () => void): Device;
  on(event: DeviceEvent.debug, cb: (message: string) => void): Device;
  removeListener(event: DeviceEvent, cb: (...args: any[]) => void): Device;

  toggle(): void;

  update(data: DeviceState): void;
}

export class YeelightDevice implements Device {
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
    const device = new YeelightDevice(config, data.ip, data.port);
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
    for (const key in data) {
      const param = key as Param;
      if (data[param] != null) this._state[param] = data[param] as any;
    }

    this.emitter.emit(DeviceEvent.update, this.state);
  }

  on(event: DeviceEvent, cb: (...args: any[]) => void): Device {
    this.emitter.on(event, cb);
    return this;
  }
  removeListener(event: DeviceEvent, cb: (...args: any[]) => void): Device {
    this.emitter.removeListener(event, cb);
    return this;
  }

  refresh(): void {
    this.execute(new GetPropCommand(this, [...Object.values(Param)]));
  }

  toggle(): void {
    this.execute(new ToggleCommand(this));
  }

  private execute(command: Command): void {
    this.commands.add(command);
    this.client.send(command.data);
    this.emitter.emit(DeviceEvent.debug, `Sent: ${command.data}`);
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
    setTimeout(() => this.refresh(), Constants.minTimeout);
    this.emitter.emit(DeviceEvent.connect);
  };

  private onData = (data: string) => {
    this.emitter.emit(DeviceEvent.debug, `Received: ${data}`);
    if (this.tryParseNotification(data) || this.tryParseResponse(data)) return;
    this.emitter.emit(DeviceEvent.warning, `Unrecognized response: ${data}`);
  };

  private onError = (err: NodeJS.ErrnoException) => {
    this.emitter.emit(DeviceEvent.warning, `Socket error: ${err.code}`);
  };

  private onClose = () => {
    this.emitter.emit(DeviceEvent.disconnect);
  };

  private tryParseNotification(data: string): boolean {
    try {
      const notification = new Notification(data);
      this.update(notification.state);
      return true;
    } catch (error) {
      this.emitter.emit(
        DeviceEvent.debug,
        `Data is not notification: ${error}`,
      );
      return false;
    }
  }

  private tryParseResponse(data: string): boolean {
    try {
      const response = new TelnetResponse(data);
      this.commands.response(response);
      return true;
    } catch (error) {
      this.emitter.emit(DeviceEvent.debug, `Data is not response: ${error}`);
      return false;
    }
  }
}
