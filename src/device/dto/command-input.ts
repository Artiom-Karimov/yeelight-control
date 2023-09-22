import { PowerMode } from '../commands/implementations/power.command';
import { AfterFlowAction } from '../enums/after-flow-actiion';
import { Feature } from '../enums/feature';
import {
  AdjustAction,
  AdjustProp,
  Effect,
  Power,
} from '../enums/string-values';

export type CommandInput =
  | TemperatureInput
  | RgbInput
  | HsvInput
  | BrightInput
  | PowerInput
  | ToggleInput
  | DefaultInput
  | StartFlowInput
  | StopFlowInput
  | SceneInput
  | OffDelayInput
  | ClearOffDelayInput
  | AdjustInput
  | NameInput
  | AdjustBrightInput
  | AdjustTemperatureInput
  | AdjustColorInput;

export interface TemperatureInput {
  feature: Feature.set_ct_abx | Feature.bg_set_ct_abx;
  value: number;
  effect?: Effect;
  duration?: number;
}

export interface RgbInput {
  feature: Feature.set_rgb | Feature.bg_set_rgb;
  value: number;
  effect?: Effect;
  duration?: number;
}

export interface HsvInput {
  feature: Feature.set_hsv | Feature.bg_set_hsv;
  hue: number;
  sat: number;
  effect?: Effect;
  duration?: number;
}

export interface BrightInput {
  feature: Feature.set_bright | Feature.bg_set_bright;
  value: number;
  effect?: Effect;
  duration?: number;
}

export interface PowerInput {
  feature: Feature.set_power | Feature.bg_set_power;
  value: Power;
  effect?: Effect;
  duration?: number;
  mode?: PowerMode;
}

export interface ToggleInput {
  feature: Feature.toggle | Feature.bg_toggle | Feature.dev_toggle;
}

export interface DefaultInput {
  feature: Feature.set_default | Feature.bg_set_default;
}

export interface StartFlowInput {
  feature: Feature.start_cf | Feature.bg_start_cf;
  count?: number;
  action?: AfterFlowAction;
  steps: number[];
}

export interface StopFlowInput {
  feature: Feature.stop_cf | Feature.bg_stop_cf;
}

export interface SceneInput {
  feature: Feature.set_scene | Feature.bg_set_scene;
  brightness: number;
  command:
    | RgbInput
    | HsvInput
    | TemperatureInput
    | StartFlowInput
    | OffDelayInput;
}

export interface OffDelayInput {
  feature: Feature.cron_add;
  minutes: number;
}

export interface ClearOffDelayInput {
  feature: Feature.cron_del;
}

export interface AdjustInput {
  feature: Feature.set_adjust | Feature.bg_set_adjust;
  action: AdjustAction;
  prop: AdjustProp;
}

export interface NameInput {
  feature: Feature.set_name;
  name: string;
}

export interface AdjustBrightInput {
  feature: Feature.adjust_bright | Feature.bg_adjust_bright;
  percentage: number;
  duration?: number;
}

export interface AdjustTemperatureInput {
  feature: Feature.adjust_ct | Feature.bg_adjust_ct;
  percentage: number;
  duration?: number;
}

export interface AdjustColorInput {
  feature: Feature.adjust_color | Feature.bg_adjust_color;
  percentage: number;
  duration?: number;
}
