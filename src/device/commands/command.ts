import { Device } from '../device';
import { Feature } from '../enums/feature';
import { CommandId } from './command-id';
import { Response } from './response';

export interface CommandData {
  id: number;
  method: Feature;
  params: Array<string | number>;
}
export interface Command {
  get id(): number;
  get createdAt(): Date;
  get device(): Device;
  get feature(): Feature;
  get data(): CommandData;

  /** Apply response from device. Returns false if command id does not match */
  response(response: Response): boolean;
}
export abstract class BaseCommand implements Command {
  protected readonly _id = CommandId.next();
  protected readonly _createdAt = new Date();
  protected readonly _device: Device;
  protected readonly _feature: Feature;

  constructor(device: Device, feature: Feature) {
    this._device = device;
    this._feature = feature;
  }

  get id(): number {
    return this._id;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get device(): Device {
    return this._device;
  }
  get feature(): Feature {
    return this._feature;
  }

  abstract get data(): CommandData;

  abstract response(response: Response): boolean;

  protected matches(response: Response): boolean {
    return response.id === this._id;
  }
}
