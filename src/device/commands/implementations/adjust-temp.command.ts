import { AdjustTempInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';
import { Device } from '../../device';

export class AdjustTempCommand extends BaseCommand {
  private readonly percentage: number;
  private readonly duration: number;

  constructor(
    device: Device,
    { feature, percentage, duration }: AdjustTempInput,
  ) {
    super(device, feature);

    if (percentage < -100 || percentage > 100)
      throw new Error(
        `Illegal percentage: ${percentage}, should be -100 ~ 100`,
      );

    if (duration == null) duration = 500;

    this.percentage = percentage;
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
