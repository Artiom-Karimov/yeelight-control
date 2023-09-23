import { Device } from '../../device';
import { ToggleInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';

export class ToggleCommand extends BaseCommand {
  constructor(device: Device, { feature }: ToggleInput) {
    super(device, feature);
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [],
    };
  }

  protected feedback(): void {
    return;
  }
}
