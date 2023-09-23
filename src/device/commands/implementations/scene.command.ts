import { Command, CommandData } from '../command';
import { BaseCommand } from '../base-command';
import { Device } from 'src/device/device';
import {
  CommandInput,
  HsvInput,
  OffDelayInput,
  RgbInput,
  SceneInput,
  TemperatureInput,
} from '../../dto/command-input';
import { RgbCommand } from './rgb.command';
import { HsvCommand } from './hsv.command';
import { TemperatureCommand } from './temperature.command';
import { StartFlowCommand } from './start-flow.command';
import { OffDelayCommand } from './off-delay.command';

type SceneClass = 'color' | 'hsv' | 'ct' | 'cf' | 'auto_delay_off';

export class SceneCommand extends BaseCommand {
  private readonly brightness: number;
  private readonly subCommand: Command;
  private readonly subInput: CommandInput;
  private readonly class: SceneClass;

  constructor(
    device: Device,
    subCommand: Command,
    { brightness, command, feature }: SceneInput,
  ) {
    super(device, feature);

    if (brightness < 0 || brightness > 100)
      throw new Error(`Wrong brightness value: ${brightness}`);

    this.brightness = brightness;
    this.subCommand = subCommand;
    this.subInput = command;
    this.class = this.getClass();
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: this.getParams(),
    };
  }

  protected feedback(): void {
    return;
  }

  private getClass(): SceneClass {
    if (this.subCommand instanceof RgbCommand) return 'color';
    if (this.subCommand instanceof HsvCommand) return 'hsv';
    if (this.subCommand instanceof TemperatureCommand) return 'ct';
    if (this.subCommand instanceof StartFlowCommand) return 'cf';
    if (this.subCommand instanceof OffDelayCommand) return 'auto_delay_off';

    throw new Error(`Unknown scene command: ${this.subCommand.feature}`);
  }

  private getParams(): Array<number | string> {
    if (this.class === 'color') return this.getColorParams();
    if (this.class === 'hsv') return this.getHsvParams();
    if (this.class === 'ct') return this.getCtParams();
    if (this.class === 'cf') return this.getCfParams();
    if (this.class === 'auto_delay_off') return this.getDelayParams();

    throw new Error(`Unknown scene class: ${this.class}`);
  }

  private getColorParams(): Array<number | string> {
    const input = this.subInput as RgbInput;
    return [this.class, input.value, this.brightness];
  }

  private getHsvParams(): Array<number | string> {
    const input = this.subInput as HsvInput;
    return [this.class, input.hue, input.sat, this.brightness];
  }

  private getCtParams(): Array<number | string> {
    const input = this.subInput as TemperatureInput;
    return [this.class, input.value, this.brightness];
  }

  private getCfParams(): Array<number | string> {
    return [this.class, ...this.subCommand.data.params];
  }

  private getDelayParams(): Array<number | string> {
    const input = this.subInput as OffDelayInput;
    return [this.class, this.brightness, input.minutes];
  }
}
