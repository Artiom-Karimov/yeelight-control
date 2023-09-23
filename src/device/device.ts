import { DeviceState } from './dto/device-state';
import { CommandInput } from './dto/command-input';

/** Event emitted by Device instance */
export enum DeviceEvent {
  warning = 'warning',
  update = 'update',
  connect = 'connect',
  disconnect = 'disconnect',
  debug = 'debug',
}

/** Yeelight bulb, strip or lamp */

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
