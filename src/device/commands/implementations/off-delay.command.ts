import { Device } from 'src/device/device';
import { OffDelayInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';

export class OffDelayCommand extends BaseCommand {
  private readonly minutes: number;

  constructor(device: Device, { feature, minutes }: OffDelayInput) {
    super(device, feature);

    if (minutes < 1 || minutes > 60)
      throw new Error(`Illegal minutes for delay: ${minutes}. Allowed 1-60`);

    this.minutes = minutes;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [0, this.minutes],
    };
  }

  protected feedback(): void {
    this.device.update({ delayoff: this.minutes });
  }
}
