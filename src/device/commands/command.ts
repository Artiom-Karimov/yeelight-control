import { Feature } from '../feature';
import { CommandId } from './command-id';

export interface CommandData {
  id: number;
  method: Feature;
  params: Array<string | number>;
}
export interface Command {
  get id(): number;
  get createdAt(): Date;
  get device(): number;
  get feature(): Feature;
  get data(): CommandData;
}
export abstract class BaseCommand implements Command {
  protected readonly _id = CommandId.next();
  protected readonly _createdAt = new Date();
  protected readonly _device: number;
  protected readonly _feature: Feature;

  constructor(device: number, feature: Feature) {
    this._device = device;
    this._feature = feature;
  }

  get id(): number {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get device(): number {
    return this._device;
  }
  get feature(): Feature {
    return this._feature;
  }

  abstract get data(): CommandData;
}
