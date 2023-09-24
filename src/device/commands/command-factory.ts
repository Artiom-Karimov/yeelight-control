import { Device } from '../device';
import {
  AdjustBrightInput,
  AdjustColorInput,
  AdjustInput,
  AdjustColorTempInput,
  BrightInput,
  ClearOffDelayInput,
  CommandInput,
  DefaultInput,
  HsvInput,
  NameInput,
  OffDelayInput,
  PowerInput,
  RgbInput,
  SceneInput,
  StartFlowInput,
  StopFlowInput,
  ColorTempInput,
  ToggleInput,
} from '../dto/command-input';
import { Feature } from '../enums/feature';
import { Command } from './command';
import { AdjustBrightCommand } from './implementations/adjust-bright.command';
import { AdjustColorCommand } from './implementations/adjust-color.command';
import { AdjustTempCommand } from './implementations/adjust-temp.command';
import { AdjustCommand } from './implementations/adjust.command';
import { BrightCommand } from './implementations/bright.command';
import { ClearOffDelayCommand } from './implementations/clear-off-delay.command';
import { DefaultCommand } from './implementations/default.command';
import { HsvCommand } from './implementations/hsv.command';
import { NameCommand } from './implementations/name.command';
import { OffDelayCommand } from './implementations/off-delay.command';
import { PowerCommand } from './implementations/power.command';
import { RgbCommand } from './implementations/rgb.command';
import { SceneCommand } from './implementations/scene.command';
import { StartFlowCommand } from './implementations/start-flow.command';
import { StopFlowCommand } from './implementations/stop-flow.command';
import { ColorTempCommand } from './implementations/color-temp.command';
import { ToggleCommand } from './implementations/toggle.command';

export class CommandFactory {
  constructor(private readonly device: Device) {}

  get(input: CommandInput): Command {
    if (this.isTemperature(input))
      return new ColorTempCommand(this.device, input);
    if (this.isRgb(input)) return new RgbCommand(this.device, input);
    if (this.isHsv(input)) return new HsvCommand(this.device, input);
    if (this.isBright(input)) return new BrightCommand(this.device, input);
    if (this.isPower(input)) return new PowerCommand(this.device, input);
    if (this.isToggle(input)) return new ToggleCommand(this.device, input);
    if (this.isDefault(input)) return new DefaultCommand(this.device, input);
    if (this.isStartFlow(input))
      return new StartFlowCommand(this.device, input);
    if (this.isStopFlow(input)) return new StopFlowCommand(this.device, input);
    if (this.isScene(input))
      return new SceneCommand(this.device, this.get(input.command), input);
    if (this.isDelay(input)) return new OffDelayCommand(this.device, input);
    if (this.isClearDelay(input))
      return new ClearOffDelayCommand(this.device, input);
    if (this.isName(input)) return new NameCommand(this.device, input);
    if (this.isAdjust(input)) return new AdjustCommand(this.device, input);
    if (this.isAdjustBright(input))
      return new AdjustBrightCommand(this.device, input);
    if (this.isAdjustTemp(input))
      return new AdjustTempCommand(this.device, input);
    if (this.isAdjustColor(input))
      return new AdjustColorCommand(this.device, input);

    throw new Error(`Feature not implemented`);
  }

  private isTemperature(input: CommandInput): input is ColorTempInput {
    return (
      input.feature === Feature.set_ct_abx ||
      input.feature === Feature.bg_set_ct_abx
    );
  }

  private isRgb(input: CommandInput): input is RgbInput {
    return (
      input.feature === Feature.set_rgb || input.feature === Feature.bg_set_rgb
    );
  }

  private isHsv(input: CommandInput): input is HsvInput {
    return (
      input.feature === Feature.set_hsv || input.feature === Feature.bg_set_hsv
    );
  }

  private isBright(input: CommandInput): input is BrightInput {
    return (
      input.feature === Feature.set_bright ||
      input.feature === Feature.bg_set_bright
    );
  }

  private isPower(input: CommandInput): input is PowerInput {
    return (
      input.feature === Feature.set_power ||
      input.feature === Feature.bg_set_power
    );
  }

  private isToggle(input: CommandInput): input is ToggleInput {
    return (
      input.feature === Feature.toggle ||
      input.feature === Feature.bg_toggle ||
      input.feature === Feature.dev_toggle
    );
  }

  private isDefault(input: CommandInput): input is DefaultInput {
    return (
      input.feature === Feature.set_default ||
      input.feature === Feature.bg_set_default
    );
  }

  private isStartFlow(input: CommandInput): input is StartFlowInput {
    return (
      input.feature === Feature.start_cf ||
      input.feature === Feature.bg_start_cf
    );
  }

  private isStopFlow(input: CommandInput): input is StopFlowInput {
    return (
      input.feature === Feature.stop_cf || input.feature === Feature.bg_stop_cf
    );
  }

  private isScene(input: CommandInput): input is SceneInput {
    return (
      input.feature === Feature.set_scene ||
      input.feature === Feature.bg_set_scene
    );
  }

  private isDelay(input: CommandInput): input is OffDelayInput {
    return input.feature === Feature.cron_add;
  }

  private isClearDelay(input: CommandInput): input is ClearOffDelayInput {
    return input.feature === Feature.cron_del;
  }

  private isName(input: CommandInput): input is NameInput {
    return input.feature === Feature.set_name;
  }

  private isAdjust(input: CommandInput): input is AdjustInput {
    return (
      input.feature === Feature.set_adjust ||
      input.feature === Feature.bg_set_adjust
    );
  }

  private isAdjustBright(input: CommandInput): input is AdjustBrightInput {
    return (
      input.feature === Feature.adjust_bright ||
      input.feature === Feature.bg_adjust_bright
    );
  }

  private isAdjustTemp(input: CommandInput): input is AdjustColorTempInput {
    return (
      input.feature === Feature.adjust_ct ||
      input.feature === Feature.bg_adjust_ct
    );
  }

  private isAdjustColor(input: CommandInput): input is AdjustColorInput {
    return (
      input.feature === Feature.adjust_color ||
      input.feature === Feature.bg_adjust_color
    );
  }
}
