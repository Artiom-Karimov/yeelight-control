/** Notification params object key */
export enum Param {
  /** on: smart LED is turned on / off: smart LED is turned off */
  power = 'power',

  /** Brightness percentage. Range 1 ~ 100 */
  bright = 'bright',

  /** Color temperature. Range 1700 ~ 6500(k) */
  ct = 'ct',

  /** Color. Range 1 ~ 16777215 */
  rgb = 'rgb',

  /** Hue. Range 0 ~ 359 */
  hue = 'hue',

  /** Saturation. Range 0 ~ 100 */
  sat = 'sat',

  /** 1: rgb mode / 2: color temperature mode / 3: hsv mode */
  color_mode = 'color_mode',

  /** 0: no flow is running / 1:color flow is running */
  flowing = 'flowing',

  /** The remaining time of a sleep timer. Range 1 ~ 60 (minutes) */
  delayoff = 'delayoff',

  /** Current flow parameters (only meaningful when 'flowing' is 1) */
  flow_params = 'flow_params',

  /** 1: Music mode is on / 0: Music mode is off */
  music_on = 'music_on',

  /** The name of the device set by “set_name” command */
  name = 'name',

  /** Background light power status */
  bg_power = 'bg_power',

  /** Background light is flowing */
  bg_flowing = 'bg_flowing',

  /** Current flow parameters of background light */
  bg_flow_params = 'bg_flow_params',

  /** Color temperature of background light */
  bg_ct = 'bg_ct',

  /** 1: rgb mode / 2: color temperature mode / 3: hsv mode */
  bg_lmode = 'bg_lmode',

  /** Brightness percentage of background light */
  bg_bright = 'bg_bright',

  /** Color of background light */
  bg_rgb = 'bg_rgb',

  /** Hue of background light */
  bg_hue = 'bg_hue',

  /** Saturation of background light */
  bg_sat = 'bg_sat',

  /** Brightness of night mode light */
  nl_br = 'nl_br',

  /** 0: daylight mode / 1: moonlight mode (ceiling light only) */
  active_mode = 'active_mode',
}
