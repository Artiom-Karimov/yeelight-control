import { DeviceState } from './dto/device-state';
import { CommandInput } from './dto/command-input';

/** Event emitted by Device instance */
export type DeviceEvent =
  | 'warning'
  | 'update'
  | 'connect'
  | 'disconnect'
  | 'debug';

/** Yeelight bulb, strip or lamp */
export interface Device {
  /** Optional id. Present only if device is created from discovery */
  readonly id: number | undefined;
  /** IP address as a string '0.0.0.0' */
  readonly ip: string;
  /** Telnet port, 55443 by default */
  readonly port: number;
  /** Current status received from device */
  readonly state: DeviceState;

  /** Telnet errors, internal errors */
  on(event: 'warning', cb: (message: string) => void): Device;
  /** Status update */
  on(event: 'update', cb: (state: DeviceState) => void): Device;
  /** Device connected */
  on(event: 'connect', cb: () => void): Device;
  /** Device discovnnected */
  on(event: 'disconnect', cb: () => void): Device;
  /** Service events, data trace */
  on(event: 'debug', cb: (message: string) => void): Device;
  /** Same as for EventEmitter. Unsubscribe from specific event */
  removeListener(event: DeviceEvent, cb: (...args: any[]) => void): Device;

  /** Execute command */
  command(input: CommandInput): void;

  /** Send request message to refresh status */
  requestState(): void;

  /** Device connects automatically on create, but you can use disconnect method along with connect if needed. */
  connect(): Device;

  /** Disconnect control socket. You should use it before removing the device. */
  disconnect(): Device;

  /** Internal use only. On success, Command notifies the device */
  update(data: DeviceState): void;
}
