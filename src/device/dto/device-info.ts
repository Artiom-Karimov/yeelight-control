import { Feature } from '../enums/feature';

export type RawDeviceInfo = { [key in keyof DeviceInfo]: any };

export interface DeviceInfo {
  /** Unique device id */
  id: number;

  /** Device type */
  model?: string;

  /** Firmware version */
  fw_ver?: string;

  /** Features supported by device */
  support?: Feature[];

  /** Device name set by user */
  name?: string;
}
