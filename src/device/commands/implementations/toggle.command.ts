import { Device } from '../../device';
import { ToggleInput } from '../../dto/command-input';
import { BaseCommand, CommandData } from '../command';
import { Response } from '../response';

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

  response(response: Response): boolean {
    return this.matches(response);
  }
}
