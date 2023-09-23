import { Device } from '../../device';
import { StopFlowInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';

export class StopFlowCommand extends BaseCommand {
  constructor(device: Device, { feature }: StopFlowInput) {
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
