import { Feature } from '../feature';
import { Command, CommandData } from './command';
import { CommandId } from './command-id';

export class GetPropCommand implements Command {
  private readonly feature = Feature.get_prop;
  private readonly id = CommandId.next();

  constructor(private readonly params: PropertyKey[]) {}

  get data(): CommandData {
    return {
      id: this.id,
      method: this.feature,
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
