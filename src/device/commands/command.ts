import { Feature } from '../feature';

export interface CommandData {
  id: number;
  method: Feature;
  params: Array<string | number>;
}
export interface Command {
  get data(): CommandData;
}
