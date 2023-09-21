import { Device } from '../../device';
import { Feature } from '../../enums/feature';
import { BaseCommand, CommandData } from '../command';
import { Response } from '../response';

export class ToggleCommand extends BaseCommand {
  constructor(device: Device) {
    super(device, Feature.toggle);
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
