import { Device } from '../device';
import { Feature } from '../enums/feature';
import { Response } from './response';

/** Data to be sent to the device via telnet */
export interface CommandData {
  id: number;
  method: Feature;
  params: Array<string | number>;
}

/** Holds a single instruction for the device */
export interface Command {
  get id(): number;
  get createdAt(): Date;
  get device(): Device;
  get feature(): Feature;
  get data(): CommandData;

  /** Apply response from device. Returns false if command id does not match */
  response(response: Response): boolean;
}
