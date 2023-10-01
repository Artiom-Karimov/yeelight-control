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
import { Device } from './device';
import { DeviceEvent } from './device';

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

    this.emitter.emit('update', this.state);
  }

  on(event: DeviceEvent, cb: (...args: any[]) => void): Device {
    this.emitter.on(event, cb);
    return this;
  }
  removeListener(event: DeviceEvent, cb: (...args: any[]) => void): Device {
    this.emitter.removeListener(event, cb);
    return this;
  }

  requestState(): void {
    this.execute(new GetPropCommand(this, [...Object.values(Param)]));
  }

  command(input: CommandInput): void {
    try {
      const command = this.factory.get(input);
      this.execute(command);
    } catch (error) {
      this.emitter.emit('warning', error);
    }
  }

  connect(): Device {
    this.client.connect();
    return this;
  }
  disconnect(): Device {
    this.client.disconnect();
    return this;
  }

  private execute(command: Command): void {
    this.commands.add(command);
    this.client.send(command.data);
    this.emitter.emit('debug', `Sent: ${command.data}`);
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
    setTimeout(() => this.requestState(), Constants.minTimeout);
    this.emitter.emit('connect');
  };

  private onData = (data: string) => {
    this.emitter.emit('debug', `Received: ${data}`);
    if (this.tryParseNotification(data) || this.tryParseResponse(data)) return;
    this.emitter.emit('warning', `Unrecognized response: ${data}`);
  };

  private onError = (err: NodeJS.ErrnoException) => {
    this.emitter.emit('warning', `Socket error: ${err.code}`);
  };

  private onClose = () => {
    this.emitter.emit('disconnect');
  };

  private tryParseNotification(data: string): boolean {
    try {
      const notification = new Notification(data);
      this.update(notification.state);
      return true;
    } catch (error) {
      this.emitter.emit('debug', `Cannot parse notification: ${error}`);
      return false;
    }
  }

  private tryParseResponse(data: string): boolean {
    try {
      const response = new TelnetResponse(data);
      this.commands.response(response);
      return true;
    } catch (error) {
      this.emitter.emit('debug', `Cannot parse response: ${error}`);
      return false;
    }
  }
}
