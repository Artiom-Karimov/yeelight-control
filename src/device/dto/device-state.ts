import { ColorMode } from '../enums/color-mode';
import { Param } from '../enums/param';
import { Power } from '../enums/string-values';

export type RawDeviceState = { [key in Param]?: string };

export interface DeviceState extends StateMap {
  /** Power state */
  power?: Power;

  /** Brightness (1-100) */
  bright?: number;

  /** Color temperature. Range 1700 ~ 6500(k) */
  ct?: number;

  /** Color. Range 1 ~ 16777215 */
  rgb?: number;

  /** Hue value in degrees (0-359) */
  hue?: number;

  /** Saturation (0-100) */
  sat?: number;

  /** Current device mode */
  color_mode?: ColorMode;

  /** 0: no flow is running / 1:color flow is running */
  flowing?: number;

  /** The remaining time of a sleep timer. Range 1 ~ 60 (minutes) */
  delayoff?: number;

  /** Current flow parameters (only meaningful when 'flowing' is 1) */
  flow_params?: Array<string | number>;

  /** 1: Music mode is on / 0: Music mode is off */
  music_on?: number;

  /** The name of the device set by “set_name” command */
  name?: string;

  /** Background light power status */
  bg_power?: Power;

  /** Background light is flowing */
  bg_flowing?: number;

  /** Current flow parameters of background light */
  bg_flow_params?: Array<string | number>;

  /** Color temperature of background light */
  bg_ct?: number;

  /** 1: rgb mode / 2: color temperature mode / 3: hsv mode */
  bg_lmode?: ColorMode;

  /** Brightness percentage of background light */
  bg_bright?: number;

  /** Color of background light */
  bg_rgb?: number;

  /** Hue of background light */
  bg_hue?: number;

  /** Saturation of background light */
  bg_sat?: number;

  /** Brightness of night mode light */
  nl_br?: number;

  /** 0: daylight mode / 1: moonlight mode (ceiling light only) */
  active_mode?: number;
}

type StateMap = {
  [key in Param]?: any;
};
