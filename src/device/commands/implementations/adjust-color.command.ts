import { Device } from '../../device';
import { AdjustColorInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';

export class AdjustColorCommand extends BaseCommand {
  private readonly percentage: number;
  private readonly duration: number;

  constructor(device: Device, { feature, duration }: AdjustColorInput) {
    super(device, feature);

    if (duration == null) duration = 500;

    this.percentage = 20; // Doesn't affect anything
    this.duration = duration;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.percentage, this.duration],
    };
  }

  protected feedback(): void {
    return;
  }
}
