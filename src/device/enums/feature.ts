/** Features supported by device */
export enum Feature {
  /** Request current state */
  get_prop = 'get_prop',

  /** Set color temperature */
  set_ct_abx = 'set_ct_abx',

  /** Set color as 24-bit integer */
  set_rgb = 'set_rgb',

  /** Set color as hue/saturation */
  set_hsv = 'set_hsv',

  /** Set brightness level */
  set_bright = 'set_bright',

  /** Turn on/off  */
  set_power = 'set_power',

  /** Toggle on/off */
  toggle = 'toggle',

  /** Set current state as default after power cycle */
  set_default = 'set_default',

  /** Start color flow with given sequence */
  start_cf = 'start_cf',

  /** Stop color flow */
  stop_cf = 'stop_cf',

  /** Set state even if device is off */
  set_scene = 'set_scene',

  /** Set auto-off delay */
  cron_add = 'cron_add',

  /** Get current auto-off delay state */
  cron_get = 'cron_get',

  /** Cancel auto-off delay */
  cron_del = 'cron_del',

  /** Increase/decrease selected parameter */
  set_adjust = 'set_adjust',

  /** Connect to music device */
  set_music = 'set_music',

  /** Set device name */
  set_name = 'set_name',

  /** Set background color as 24-bit integer */
  bg_set_rgb = 'bg_set_rgb',

  /** Set background color as hue/saturation */
  bg_set_hsv = 'bg_set_hsv',

  /** Set background color temperature */
  bg_set_ct_abx = 'bg_set_ct_abx',

  /** Start background color flow */
  bg_start_cf = 'bg_start_cf',

  /** Stop background color flow */
  bg_stop_cf = 'bg_stop_cf',

  /** Set background state even if device is off */
  bg_set_scene = 'bg_set_scene',

  /** Set current background state as default after power cycle */
  bg_set_default = 'bg_set_default',

  /** Power on/off background */
  bg_set_power = 'bg_set_power',

  /** Set background brightness */
  bg_set_bright = 'bg_set_bright',

  /** Increase/decrease selected background parameter */
  bg_set_adjust = 'bg_set_adjust',

  /** Toggle background on/off */
  bg_toggle = 'bg_toggle',

  /** Toggle main & background lights on/off */
  dev_toggle = 'dev_toggle',

  /** Change brightness by value */
  adjust_bright = 'adjust_bright',

  /** Change color temperature by value */
  adjust_ct = 'adjust_ct',

  /** Change color by value */
  adjust_color = 'adjust_color',

  /** Change background brightness by value */
  bg_adjust_bright = 'bg_adjust_bright',

  /** Change background color temperature by value */
  bg_adjust_ct = 'bg_adjust_ct',

  /** Change background color by value */
  bg_adjust_color = 'bg_adjust_color',

  udp_sess_new = 'udp_sess_new',
  udp_sess_keep_alive = 'udp_sess_keep_alive',
  udp_chroma_sess_new = 'udp_chroma_sess_new',
}
