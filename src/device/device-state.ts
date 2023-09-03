import { ColorMode } from './enums/color-mode';
import { Feature } from './enums/feature';

export interface DeviceState {
  /** Unique device id */
  id?: number;
  /** Device type */
  model?: string;
  /** Firmware version */
  fw_ver?: string;
  /** Features supported by device */
  support?: Feature[];
  /** Power state */
  power?: 'on' | 'off';
  /** Brightness (1-100) */
  bright?: number;
  /** Current device mode */
  color_mode?: ColorMode;
  /** Color temperature */
  ct?: number;
  /** Color in RGB format */
  rgb?: number;
  /** Hue value in degrees (0-359) */
  hue?: number;
  /** Saturation (0-100) */
  sat?: number;
  /** Device name set by user */
  name?: string;
}
