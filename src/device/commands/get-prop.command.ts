import { Feature } from '../feature';
import { BaseCommand, CommandData } from './command';

export class GetPropCommand extends BaseCommand {
  constructor(
    device: number,
    private readonly params: PropertyKey[],
  ) {
    super(device, Feature.get_prop);
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: [...(this.params as string[])],
    };
  }
}

export enum PropertyKey {
  power = 'power',
  bright = 'bright',
  color_mode = 'color_mode',
  ct = 'ct',
  rgb = 'rgb',
  hue = 'hue',
  sat = 'sat',
  name = 'name',
}
