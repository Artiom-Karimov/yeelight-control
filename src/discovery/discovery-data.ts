import { DeviceInfo } from '../device/dto/device-info';
import { DeviceState } from '../device/dto/device-state';

/** This object is genetrated by discovery mechanism.
 * It can be used to connect new device */
export interface DiscoveryData {
  readonly updatedAt: Date;
  readonly expiresAt: Date;
  readonly ip: string;
  readonly port: number;
  readonly id: number;

  /** Status values received with discovery message */
  get state(): DeviceState;
  /** General device info */
  get info(): DeviceInfo;
}
