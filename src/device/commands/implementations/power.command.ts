import { Feature } from '../../enums/feature';
import { Effect } from '../../enums/effect';
import { BaseCommand, CommandData } from '../command';
import { Device } from '../../device';
import { Power } from '../../enums/power';
import { Response } from '../response';
import { DeviceState } from '../../dto/device-state';
import { ColorMode } from '../../enums/color-mode';

export class PowerCommand extends BaseCommand {
  constructor(
    device: Device,
    private readonly value: Power,
    private readonly effect = Effect.smooth,
    private readonly duration = 500,
    private readonly mode = PowerMode.Normal,
  ) {
    super(device, Feature.set_power);
    if (this.duration < 30) this.duration = 30;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.value, this.effect, this.duration, this.mode],
    };
  }

  response(response: Response): boolean {
    if (!this.matches(response)) return false;
    if (!response.success)
      throw new Error(`Command failed: ${JSON.stringify(response.error)}`);

    this.feedback();
    return true;
  }

  private feedback(): void {
    const result: DeviceState = { power: this.value };

    if (this.mode === PowerMode.ColorTemperature) {
      result.color_mode = ColorMode.Temperature;
    } else if (this.mode === PowerMode.HSV) {
      result.color_mode = ColorMode.HSV;
    } else if (this.mode === PowerMode.RGB) {
      result.color_mode = ColorMode.Color;
    }

    this.device.update(result);
  }
}

export enum PowerMode {
  Normal = 0,
  ColorTemperature = 1,
  RGB = 2,
  HSV = 3,
  ColorFlow = 4,
  NightLight = 5,
}
