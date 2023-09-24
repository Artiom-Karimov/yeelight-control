import { Config, ConfigParams, YeelightConfig } from './config';
import { DiscoveredList } from './discovery/discovered-list';
import { Discovery } from './discovery/discovery';
import { DiscoveryData } from './discovery/discovery-data';
import { DeviceList } from './device/device-list';
import { Device } from './device/device';
import { EventEmitter } from 'node:events';

export type YeelightEvent = 'discovery' | 'warning';

/** Root of Yeelight operations.
 * Use it to discover and connect devices (bulbs, strips, lamps)
 * @example
 * const yeelight = new Yeelight();
 * const device = yeelight.connectOne('192.168.1.5');
 * @example
 * const yeelight = new Yeelight();
 * const devices = new Set<Device>();
 * yeelight.on('discovery', (data) => {
 *  devices.add(yeelight.connectDiscovered(data[0]));
 * });
 */
export class Yeelight {
  private readonly config: Config;
  private readonly discovered: DiscoveredList;
  private readonly discovery: Discovery;
  private readonly devices: DeviceList;

  private readonly emitter = new EventEmitter();

  constructor(params?: ConfigParams) {
    this.config = new YeelightConfig(params);
    this.discovered = new DiscoveredList();
    this.discovery = new Discovery(this.config, this.discovered);
    this.devices = new DeviceList(this.config);

    this.initializeEvents();
  }

  /** Add device to system by known ip/port and connect immediately.
   * If device already exists, an existing one will be returned.
   * @param ip IP address as a string '0.0.0.0'
   * @param [port=55443] Telnet port
   * @returns Device */
  connectOne(ip: string, port?: number): Device {
    return this.devices.create(ip, port);
  }

  /** Add device by discovered data and connect immediately.
   * If device already exists, an existing one will be returned.
   * @param data Object received from 'discovery' event
   * @returns Device */
  connectDiscovered(data: DiscoveryData): Device {
    return this.devices.createFromDiscovery(data);
  }

  /** Subscribe to discovery event. Emitted each time multicast discovery message received.
   * Array is sorted by discovery time, so the 0th element is the newest
   */
  on(event: 'discovery', cb: (devices: DiscoveryData[]) => void): Yeelight;

  /** Internal errors, discovery errors */
  on(event: 'warning', cb: (message: string | Error) => void): Yeelight;

  on(event: YeelightEvent, cb: (...args: any[]) => void): Yeelight {
    this.emitter.on(event, cb);
    return this;
  }

  /** Similar to EventEmitter.removeListener. Unsubscribe from event */
  removeListener(event: YeelightEvent, cb: (...args: any[]) => void): Yeelight {
    this.emitter.removeListener(event, cb);
    return this;
  }

  private initializeEvents(): void {
    this.discovery.on('update', (data: DiscoveryData[]) =>
      this.emitter.emit('discovery', data),
    );
    this.discovery.on('error', (err) => {
      this.emitter.emit('warning', err);
    });
  }
}
