import { Device } from 'src/device/device';
import { ClearOffDelayInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';

export class ClearOffDelayCommand extends BaseCommand {
  constructor(device: Device, { feature }: ClearOffDelayInput) {
    super(device, feature);
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [0],
    };
  }

  protected feedback(): void {
    this.device.update({ delayoff: 0 });
  }
}
