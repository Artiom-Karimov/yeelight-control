import { DeviceInfo, RawDeviceInfo } from '../device/dto/device-info';
import { DeviceState, RawDeviceState } from '../device/dto/device-state';
import { FeedbackParser } from '../utils/feedback-value-parser';

/** This object is genetrated by discovery mechanism.
 * It can be used to connect new device */
export class DiscoveryData {
  public updatedAt: Date;
  public expiresAt: Date;
  public readonly ip: string;
  public readonly port: number;
  public readonly id: number;

  private rawData: { [key: string]: string } = {};
  private _state: DeviceState;
  private _info: DeviceInfo;

  private readonly parser = new FeedbackParser();

  constructor(message: string) {
    this.parseRaw(message);
    this.updatedAt = new Date();

    this._state = this.parser.parseState(this.rawData as RawDeviceState);
    this._info = this.parser.parseInfo(this.rawData as RawDeviceInfo);

    this.id = this._info.id;
    this.expiresAt = this.parseExpiration();
    [this.ip, this.port] = this.parseLocation();
  }

  get state(): DeviceState {
    return {
      ...this._state,
    };
  }

  get info(): DeviceInfo {
    return {
      ...this._info,
    };
  }

  private parseExpiration(): Date {
    const value = this.findRaw('Cache-Control');
    if (!value) throw new Error('No cache-control header in message');

    const timeout = value.substring(value.indexOf('=') + 1);
    if (!timeout || isNaN(+timeout))
      throw new Error(`Invalid header: ${value}`);

    const millis = +timeout * 1000;
    return new Date(Date.now() + millis);
  }
  private parseLocation(): [ip: string, port: number] {
    const value = this.findRaw('Location');
    if (!value) throw new Error('No location in message');

    const delimiter = 'yeelight://';
    const location = value.substring(
      value.indexOf(delimiter) + delimiter.length,
    );
    const [ip, port] = location.split(':');
    if (!ip || !port || isNaN(+port))
      throw new Error(`Wrong location: ${location}`);

    return [ip, +port];
  }

  private findRaw(key: string): string | undefined {
    return this.rawData[key.toLowerCase()];
  }

  private parseRaw(message: string): void {
    const headers = message.split('\r\n');
    if (!headers.length) throw new Error('Empty data');
    this.rawData = {};

    for (const header of headers) {
      const [key, value] = header.split(': ');
      if (!key || !value) continue;
      this.rawData[key.toLowerCase()] = value;
    }
  }
}
