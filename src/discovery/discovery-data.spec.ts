import { DiscoveryData } from './discovery-data';
import { ColorMode } from '../device/enums/color-mode';
import { Feature } from '../device/enums/feature';

const rgbBulbResponse = `HTTP/1.1 200 OK\r\nCache-Control: max-age=3600\r\nDate:\r\nExt:\r\nLocation: yeelight://192.168.88.22:55443\r\nServer: POSIX UPnP/1.0 YGLC/1\r\nid: 0x000000000e9f9104\r\nmodel: colora\r\nfw_ver: 9\r\nsupport: get_prop set_default set_power toggle set_bright set_scene cron_add cron_get cron_del start_cf stop_cf set_ct_abx adjust_ct set_name set_adjust adjust_bright adjust_color set_rgb set_hsv set_music udp_sess_new udp_sess_keep_alive udp_chroma_sess_new\r\npower: off\r\nbright: 100\r\ncolor_mode: 1\r\nct: 5725\r\nrgb: 16714471\r\nhue: 306\r\nsat: 96\r\nname:`;
const warmBulbNotify = `NOTIFY * HTTP/1.1\r\nHost: 239.255.255.250:1982\r\nCache-Control: max-age=3600\r\nLocation: yeelight://192.168.88.23:55443\r\nNTS: ssdp:alive\r\nServer: POSIX, UPnP/1.0 YGLC/1\r\nid: 0x000000000ece955f\r\nmodel: monoa\r\nfw_ver: 9\r\nsupport: get_prop set_default set_power toggle set_bright set_scene cron_add cron_get cron_del start_cf stop_cf set_name set_adjust adjust_bright\r\npower: on\r\nbright: 46\r\ncolor_mode: 2\r\nct: 2700\r\nrgb: 0\r\nhue: 0\r\nsat: 0\r\nname: sampleBulb`;
const stripResponse = `HTTP/1.1 200 OK\r\nCache-Control: max-age=1200\r\nDate: \r\nExt:\r\nLocation: yeelight://192.168.88.21:55443\r\nServer: POSIX UPnP/1.0 YGLC/1\r\nid: 0x00000000155f04bd\r\nmodel: strip6\r\nfw_ver: 20\r\nsupport: get_prop set_default set_power toggle set_bright set_scene cron_add cron_get cron_del start_cf stop_cf set_name set_adjust adjust_bright set_ct_abx adjust_ct adjust_color set_rgb set_hsv set_music udp_sess_new udp_sess_keep_alive udp_chroma_sess_new\r\npower: on\r\nbright: 15\r\ncolor_mode: 1\r\nct: 5330\r\nrgb: 16745728\r\nhue: 31\r\nsat: 100\r\nname:\r\n`;
const requestMessage = `listening 239.255.255.250 1982\r\nM-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n`;

describe('Data parsing test', () => {
  test('Should map rgb bulb values', () => {
    const data = new DiscoveryData(rgbBulbResponse);
    expect(data).toBeInstanceOf(DiscoveryData);

    expect(data.updatedAt).toBeInstanceOf(Date);
    expect(data.expiresAt).toBeInstanceOf(Date);
    expect(data.expiresAt.getTime() - data.updatedAt.getTime()).toBe(3_600_000);

    expect(data.ip).toBe('192.168.88.22');
    expect(data.port).toBe(55443);

    expect(data.id).toBe(245338372);
    expect(data.model).toBe('colora');
    expect(data.fw_ver).toBe('9');

    expect(data.support).toEqual([
      Feature.get_prop,
      Feature.set_default,
      Feature.set_power,
      Feature.toggle,
      Feature.set_bright,
      Feature.set_scene,
      Feature.cron_add,
      Feature.cron_get,
      Feature.cron_del,
      Feature.start_cf,
      Feature.stop_cf,
      Feature.set_ct_abx,
      Feature.adjust_ct,
      Feature.set_name,
      Feature.set_adjust,
      Feature.adjust_bright,
      Feature.adjust_color,
      Feature.set_rgb,
      Feature.set_hsv,
      Feature.set_music,
      Feature.udp_sess_new,
      Feature.udp_sess_keep_alive,
      Feature.udp_chroma_sess_new,
    ]);

    expect(data.power).toBe('off');
    expect(data.bright).toBe(100);
    expect(data.color_mode).toBe(ColorMode.Color);
    expect(data.ct).toBe(5725);
    expect(data.rgb).toBe(16714471);
    expect(data.hue).toBe(306);
    expect(data.sat).toBe(96);
    expect(data.name).toBeUndefined();
  });
  test('Should map warm white bulb values', () => {
    const data = new DiscoveryData(warmBulbNotify);
    expect(data).toBeInstanceOf(DiscoveryData);

    expect(data.updatedAt).toBeInstanceOf(Date);
    expect(data.expiresAt).toBeInstanceOf(Date);
    expect(data.expiresAt.getTime() - data.updatedAt.getTime()).toBe(3_600_000);

    expect(data.ip).toBe('192.168.88.23');
    expect(data.port).toBe(55443);

    expect(data.id).toBe(248419679);
    expect(data.model).toBe('monoa');
    expect(data.fw_ver).toBe('9');

    expect(data.support).toEqual([
      Feature.get_prop,
      Feature.set_default,
      Feature.set_power,
      Feature.toggle,
      Feature.set_bright,
      Feature.set_scene,
      Feature.cron_add,
      Feature.cron_get,
      Feature.cron_del,
      Feature.start_cf,
      Feature.stop_cf,
      Feature.set_name,
      Feature.set_adjust,
      Feature.adjust_bright,
    ]);

    expect(data.power).toBe('on');
    expect(data.bright).toBe(46);
    expect(data.color_mode).toBe(ColorMode.Temperature);
    expect(data.ct).toBe(2700);
    expect(data.rgb).toBe(0);
    expect(data.hue).toBe(0);
    expect(data.sat).toBe(0);
    expect(data.name).toBe('sampleBulb');
  });
  test('Should map strip6 values', () => {
    const data = new DiscoveryData(stripResponse);
    expect(data).toBeInstanceOf(DiscoveryData);

    expect(data.updatedAt).toBeInstanceOf(Date);
    expect(data.expiresAt).toBeInstanceOf(Date);
    expect(data.expiresAt.getTime() - data.updatedAt.getTime()).toBe(1_200_000);

    expect(data.ip).toBe('192.168.88.21');
    expect(data.port).toBe(55443);

    expect(data.id).toBe(358548669);
    expect(data.model).toBe('strip6');
    expect(data.fw_ver).toBe('20');

    expect(data.support).toEqual([
      Feature.get_prop,
      Feature.set_default,
      Feature.set_power,
      Feature.toggle,
      Feature.set_bright,
      Feature.set_scene,
      Feature.cron_add,
      Feature.cron_get,
      Feature.cron_del,
      Feature.start_cf,
      Feature.stop_cf,
      Feature.set_name,
      Feature.set_adjust,
      Feature.adjust_bright,
      Feature.set_ct_abx,
      Feature.adjust_ct,
      Feature.adjust_color,
      Feature.set_rgb,
      Feature.set_hsv,
      Feature.set_music,
      Feature.udp_sess_new,
      Feature.udp_sess_keep_alive,
      Feature.udp_chroma_sess_new,
    ]);

    expect(data.power).toBe('on');
    expect(data.bright).toBe(15);
    expect(data.color_mode).toBe(ColorMode.Color);
    expect(data.ct).toBe(5330);
    expect(data.rgb).toBe(16745728);
    expect(data.hue).toBe(31);
    expect(data.sat).toBe(100);
    expect(data.name).toBeUndefined();
  });
  test('Should throw error on request data', () => {
    const shouldFail = () => {
      new DiscoveryData(requestMessage);
    };

    expect(shouldFail).toThrowError();
  });
});
