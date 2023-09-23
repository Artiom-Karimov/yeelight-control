import { BaseCommand, CommandData } from '../command';
import { Device } from '../../device';
import { ColorMode } from '../../enums/color-mode';
import { PowerInput } from '../../dto/command-input';
import { Feature } from '../../enums/feature';
import { Effect, Power } from '../../enums/string-values';

export class PowerCommand extends BaseCommand {
  private readonly value: Power;
  private readonly effect: Effect;
  private readonly duration: number;
  private readonly mode: PowerMode;

  constructor(
    device: Device,
    { value, effect, duration, mode, feature }: PowerInput,
  ) {
    super(device, feature);

    if (duration == null) duration = 500;
    if (duration < 30) duration = 30;

    this.value = value;
    this.effect = effect || 'smooth';
    this.duration = duration;
    this.mode = mode || PowerMode.Normal;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.value, this.effect, this.duration, this.mode],
    };
  }

  protected feedback(): void {
    if (this.feature === Feature.set_power) return this.mainFeedback();
    if (this.feature === Feature.bg_set_power) return this.bgFeedback();
  }

  private mainFeedback(): void {
    this.device.update({
      power: this.value,
      color_mode: this.modeFeedback(),
    });
  }

  private bgFeedback(): void {
    this.device.update({
      bg_power: this.value,
      bg_lmode: this.modeFeedback(),
    });
  }

  private modeFeedback(): ColorMode | undefined {
    if (this.mode === PowerMode.ColorTemperature) return ColorMode.Temperature;
    if (this.mode === PowerMode.HSV) return ColorMode.HSV;
    if (this.mode === PowerMode.RGB) return ColorMode.Color;

    return undefined;
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
