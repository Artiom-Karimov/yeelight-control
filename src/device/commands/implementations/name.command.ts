import { Device } from '../../device';
import { NameInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';

export class NameCommand extends BaseCommand {
  private readonly name: string;

  constructor(device: Device, { feature, name }: NameInput) {
    super(device, feature);

    this.name = name;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.name],
    };
  }

  protected feedback(): void {
    this.device.update({ name: this.name });
  }
}
