import { EventEmitter } from 'events';
import { Config } from '../config';
import { DiscoveryData } from '../discovery/discovery-data';
import { SetupParser } from '../utils/setup-value-parser';
import { TelnetClient, TelnetEvent } from '../utils/telnet-client';
import { CommandCache } from './commands/command-cache';
import { DeviceState } from './dto/device-state';
import { Notification } from './commands/notification';
import { TelnetResponse } from './commands/response';
import { Command } from './commands/command';
import { GetPropCommand } from './commands/implementations/get-prop.command';
import { Param } from './enums/param';
import { Constants } from '../constants';
import { CommandInput } from './dto/command-input';
import { CommandFactory } from './commands/command-factory';

export enum DeviceEvent {
  warning = 'warning',
  update = 'update',
  connect = 'connect',
  disconnect = 'disconnect',
  debug = 'debug',
}

export interface Device {
  readonly id: number | undefined;
  readonly ip: string;
  readonly port: number;
  readonly state: DeviceState;

  on(event: DeviceEvent.warning, cb: (message: string) => void): Device;
  on(event: DeviceEvent.update, cb: (state: DeviceState) => void): Device;
  on(event: DeviceEvent.connect, cb: () => void): Device;
  on(event: DeviceEvent.disconnect, cb: () => void): Device;
  on(event: DeviceEvent.debug, cb: (message: string) => void): Device;
  removeListener(event: DeviceEvent, cb: (...args: any[]) => void): Device;

  command(input: CommandInput): void;

  refresh(): void;
  update(data: DeviceState): void;
}

export class YeelightDevice implements Device {
  public readonly ip: string;
  public readonly port: number;

  private _state: DeviceState = {};
  private _id?: number;

  private readonly commands: CommandCache;
  private readonly factory: CommandFactory;
  private readonly client: TelnetClient;
  private readonly emitter = new EventEmitter();

  constructor(config: Config, ip: string, port: number | undefined) {
    this.ip = SetupParser.ip(ip);
    this.port = port
      ? SetupParser.port(port)
      : config.get<number>('controlPort');

    this.commands = new CommandCache(config);
    this.factory = new CommandFactory(this);
    this.client = new TelnetClient(this.ip, this.port, true);
    this.setupClient();
  }
  public static fromDiscovery(config: Config, data: DiscoveryData): Device {
    const device = new YeelightDevice(config, data.ip, data.port);
    device._id = data.id;
    device._state = data.state;

    return device;
  }

  get state(): DeviceState {
    return { ...this._state };
  }
  get id(): number | undefined {
    return this._id;
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

  command(input: CommandInput): void {
    try {
      const command = this.factory.get(input);
      this.execute(command);
    } catch (error) {
      this.emitter.emit(DeviceEvent.warning, error);
    }
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
        `Cannot parse notification: ${error}`,
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
      this.emitter.emit(DeviceEvent.debug, `Cannot parse response: ${error}`);
      return false;
    }
  }
}
