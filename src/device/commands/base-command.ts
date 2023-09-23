import { Device } from '../device';
import { Feature } from '../enums/feature';
import { CommandId } from './command-id';
import { Response } from './response';
import { Command, CommandData } from './command';

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

  response(response: Response): boolean {
    if (response.id !== this._id) return false;
    if (!response.success)
      throw new Error(
        `Command ${this.feature} failed: ${JSON.stringify(response.error)}`,
      );

    this.feedback(response);
    return true;
  }

  protected abstract feedback(response: Response): void;
}
