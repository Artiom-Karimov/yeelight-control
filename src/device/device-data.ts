export class DeviceData {
  /** Data received */
  updatedAt: Date;
  /** Data will be irrelevant at this time */
  expiresAt: Date;
  /** Device address */
  ip: string;
  /** Device control port */
  port: number;
  /** Unique device id */
  id: number;
  /** Device type */
  model: string;
  /** Firmware version */
  fw_ver: string;
  /** Features supported by device */
  support: Feature[];
  /** Power state */
  power: 'on' | 'off';
  /** Brightness (1-100) */
  bright: number;
  /** Current device mode */
  color_mode: ColorMode;
  /** Color temperature */
  ct: number;
  /** Color in RGB format */
  rgb: number;
  /** Hue value in degrees (0-359) */
  hue: number;
  /** Saturation (0-100) */
  sat: number;
  /** Device name set by user */
  name?: string;

  private rawData: { [key: string]: string };

  constructor(message: string) {
    this.parseRaw(message);
    this.updatedAt = new Date();

    this.parseExpiration();
    this.parseLocation();
    this.parseId();
    this.parseSupport();
    this.parsePower();
    this.parseMode();
    this.parseNumbers();

    this.model = this.findRaw('model');
    this.fw_ver = this.findRaw('fw_ver');
    this.name = this.findRaw('name');
  }

  private parseExpiration(): void {
    const value = this.findRaw('Cache-Control');
    if (!value) throw new Error('No cache-control header in message');

    const timeout = value.substring(value.indexOf('=') + 1);
    if (!timeout || isNaN(+timeout))
      throw new Error(`Invalid header: ${value}`);

    const millis = +timeout * 1000;
    this.expiresAt = new Date(Date.now() + millis);
  }
  private parseLocation(): void {
    const value = this.findRaw('Location');
    if (!value) throw new Error('No location in message');

    const delimiter = 'yeelight://';
    const location = value.substring(
      value.indexOf(delimiter) + delimiter.length,
    );
    const [ip, port] = location.split(':');
    if (!ip || !port || isNaN(+port))
      throw new Error(`Wrong location: ${location}`);

    this.ip = ip;
    this.port = +port;
  }
  private parseId(): void {
    const value = this.findRaw('id');
    if (!value) throw new Error('No id in message');
    const num = parseInt(value, 16);
    if (isNaN(num)) throw new Error(`Wrong device id: ${value}`);
    this.id = num;
  }
  private parseSupport(): void {
    const line = this.findRaw('support');
    const features = line.split(' ');
    this.support = features.filter((f) => this.isFeature(f)) as Feature[];
  }
  private isFeature(feature: string): feature is Feature {
    return Object.values(Feature).includes(feature as Feature);
  }
  private parsePower(): void {
    const state = this.findRaw('power');
    this.power = state === 'on' ? 'on' : 'off';
  }
  private parseMode(): void {
    const value = this.findRaw('color_mode');
    const num = +value;
    if (isNaN(num)) throw new Error(`Wrong color_mode: ${value}`);
    this.color_mode = num as ColorMode;
  }

  private parseNumbers(): void {
    this.bright = +this.findRaw('bright') || 0;
    this.ct = +this.findRaw('ct') || 0;
    this.rgb = +this.findRaw('rgb') || 0;
    this.hue = +this.findRaw('hue') || 0;
    this.sat = +this.findRaw('sat') || 0;
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

export enum Feature {
  get_prop = 'get_prop',
  set_default = 'set_default',
  set_power = 'set_power',
  toggle = 'toggle',
  set_bright = 'set_bright',
  set_scene = 'set_scene',
  cron_add = 'cron_add',
  cron_get = 'cron_get',
  cron_del = 'cron_del',
  start_cf = 'start_cf',
  stop_cf = 'stop_cf',
  set_ct_abx = 'set_ct_abx',
  adjust_ct = 'adjust_ct',
  set_name = 'set_name',
  set_adjust = 'set_adjust',
  adjust_bright = 'adjust_bright',
  adjust_color = 'adjust_color',
  set_rgb = 'set_rgb',
  set_hsv = 'set_hsv',
  set_music = 'set_music',
  udp_sess_new = 'udp_sess_new',
  udp_sess_keep_alive = 'udp_sess_keep_alive',
  udp_chroma_sess_new = 'udp_chroma_sess_new',
}

export enum ColorMode {
  Color = 1,
  Temperature = 2,
  HSV = 3,
}
