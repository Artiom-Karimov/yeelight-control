import { Device } from '../../device';
import { AdjustInput } from '../../dto/command-input';
import { CommandData } from '../command';
import { BaseCommand } from '../base-command';
import { AdjustAction, AdjustProp } from '../../enums/string-values';

export class AdjustCommand extends BaseCommand {
  private readonly action: AdjustAction;
  private readonly prop: AdjustProp;

  constructor(device: Device, { feature, action, prop }: AdjustInput) {
    super(device, feature);

    this.action = action;
    this.prop = prop;
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [this.action, this.prop],
    };
  }

  protected feedback(): void {
    return;
  }
}
