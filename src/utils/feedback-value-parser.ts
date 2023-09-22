import { DeviceInfo, RawDeviceInfo } from '../device/dto/device-info';
import { DeviceState, RawDeviceState } from '../device/dto/device-state';
import { ColorMode } from '../device/enums/color-mode';
import { Feature } from '../device/enums/feature';
import { FlowParams } from '../device/dto/flow-expression';
import { AfterFlowAction } from '../device/enums/after-flow-actiion';
import { Power } from '../device/enums/string-values';

export class FeedbackParser {
  parseState(data: RawDeviceState): DeviceState {
    return {
      power: this.power(data.power),
      bright: this.integer(data.bright),
      ct: this.integer(data.ct),
      rgb: this.integer(data.rgb),
      hue: this.integer(data.hue),
      sat: this.integer(data.sat),
      color_mode: this.colorMode(data.color_mode),
      flowing: this.integer(data.flowing),
      delayoff: this.integer(data.delayoff),
      flow_params: this.flowParams(data.flow_params),
      music_on: this.integer(data.music_on),
      name: this.text(data.name),
      bg_power: this.power(data.bg_power),
      bg_flowing: this.integer(data.bg_flowing),
      bg_flow_params: this.flowParams(data.bg_flow_params),
      bg_ct: this.integer(data.bg_ct),
      bg_lmode: this.colorMode(data.bg_lmode),
      bg_bright: this.integer(data.bg_bright),
      bg_rgb: this.integer(data.bg_rgb),
      bg_hue: this.integer(data.bg_hue),
      bg_sat: this.integer(data.bg_sat),
      nl_br: this.integer(data.nl_br),
      active_mode: this.integer(data.active_mode),
    };
  }
  parseInfo(data: RawDeviceInfo): DeviceInfo {
    return {
      id: this.id(data.id),
      model: this.text(data.model),
      fw_ver: this.text(data.fw_ver),
      support: this.support(data.support),
      name: this.text(data.name),
    };
  }

  private integer(value: unknown): number | undefined {
    if (value == null) return undefined;
    const result = +value;
    if (isNaN(result) || result % 1 !== 0) return undefined;

    return result;
  }

  private text(value: unknown): string | undefined {
    if (!this.checkString(value)) return undefined;
    return value.trim();
  }

  private power(value: unknown): Power | undefined {
    if (!this.checkString(value)) return undefined;
    return value === 'on' ? 'on' : 'off';
  }

  private colorMode(value: unknown): ColorMode | undefined {
    const result = this.integer(value);
    return result == null ? undefined : (result as ColorMode);
  }

  private flowParams(value: unknown): FlowParams | undefined {
    if (typeof value !== 'string') return undefined;
    const data = value.split(',');
    if (!Array.isArray(data) || data.length < 6) {
      return undefined;
    }

    return [+data[0], +data[1] as AfterFlowAction, data.slice(2).join(',')];
  }

  private id(value: unknown): number {
    if (!this.checkString(value)) throw new Error('No id in message');

    const result = parseInt(value, 16);
    if (isNaN(result)) throw new Error(`Wrong device id: ${value}`);
    return result;
  }

  private support(value: unknown): Array<Feature> | undefined {
    if (!this.checkString(value)) return undefined;

    const features = value.split(' ');
    return features.filter((f) => this.isFeature(f)) as Feature[];
  }
  private isFeature(feature: string): feature is Feature {
    return Object.values(Feature).includes(feature as Feature);
  }

  private checkString(value: unknown): value is string {
    return typeof value === 'string' && value.length > 0;
  }
}
