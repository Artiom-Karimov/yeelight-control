import { Device } from '../device';
import { CommandInput } from '../dto/command-input';
import { Feature } from '../enums/feature';
import { Command } from './command';
import { BrightCommand } from './implementations/bright.command';
import { HsvCommand } from './implementations/hsv.command';
import { PowerCommand } from './implementations/power.command';
import { RgbCommand } from './implementations/rgb.command';
import { TemperatureCommand } from './implementations/temperature.command';
import { ToggleCommand } from './implementations/toggle.command';

export class CommandFactory {
  constructor(private readonly device: Device) {}

  get(input: CommandInput): Command {
    const feature = input.feature;

    if (feature === Feature.set_ct_abx || feature === Feature.bg_set_ct_abx)
      return new TemperatureCommand(this.device, input);

    if (feature === Feature.set_rgb || feature === Feature.bg_set_rgb)
      return new RgbCommand(this.device, input);

    if (feature === Feature.set_hsv || feature === Feature.bg_set_hsv)
      return new HsvCommand(this.device, input);

    if (feature === Feature.set_bright || feature === Feature.bg_set_bright)
      return new BrightCommand(this.device, input);

    if (feature === Feature.set_power || feature === Feature.bg_set_power)
      return new PowerCommand(this.device, input);

    if (
      feature === Feature.toggle ||
      feature === Feature.bg_toggle ||
      feature === Feature.dev_toggle
    )
      return new ToggleCommand(this.device, input);

    throw new Error(`Feature ${feature} not implemented`);
  }
}
