import { PowerOnMode } from '../commands/implementations/power.command';
import { AfterFlowAction } from '../enums/after-flow-actiion';
import { Feature } from '../enums/feature';
import {
  AdjustAction,
  AdjustProp,
  Effect,
  Power,
} from '../enums/string-values';
import { FlowStep } from './flow-expression';

/** Data to be sent to the device */
export type CommandInput =
  | ColorTempInput
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
  | AdjustColorTempInput
  | AdjustColorInput;

/** Set color temperature */
export interface ColorTempInput {
  feature: Feature.set_ct_abx | Feature.bg_set_ct_abx;

  /** Color temperature: 1700 ~ 6500 */
  value: number;

  /** Transition style. Can be 'smooth' or 'sudden'. If undefined, set to 'smooth' */
  effect?: Effect;

  /** Transition time in milliseconds.
   * Ignored when effect is 'sudden'. If undefined, set to 500 */
  duration?: number;
}

/** Set color as RGB */
export interface RgbInput {
  feature: Feature.set_rgb | Feature.bg_set_rgb;

  /** RGB value, 0 ~ 0xFFFFFF */
  value: number;

  /** Transition style. Can be 'smooth' or 'sudden'. If undefined, set to 'smooth' */
  effect?: Effect;

  /** Transition time in milliseconds.
   * Ignored when effect is 'sudden'. If undefined, set to 500 */
  duration?: number;
}

/** Set color as hue/saturation */
export interface HsvInput {
  feature: Feature.set_hsv | Feature.bg_set_hsv;

  /** Hue in degrees: 0 ~ 359 */
  hue: number;

  /** Saturation: 0 ~ 100 */
  sat: number;

  /** Transition style. Can be 'smooth' or 'sudden'. If undefined, set to 'smooth' */
  effect?: Effect;

  /** Transition time in milliseconds.
   * Ignored when effect is 'sudden'. If undefined, set to 500 */
  duration?: number;
}

/** Set overall brightness */
export interface BrightInput {
  feature: Feature.set_bright | Feature.bg_set_bright;

  /** Brightness in percent: 0 ~ 100 */
  value: number;

  /** Transition style. Can be 'smooth' or 'sudden'. If undefined, set to 'smooth' */
  effect?: Effect;

  /** Transition time in milliseconds.
   * Ignored when effect is 'sudden'. If undefined, set to 500 */
  duration?: number;
}

/** Power on/off. Turns off the light, not the whole device */
export interface PowerInput {
  feature: Feature.set_power | Feature.bg_set_power;

  /** Power value. Can be 'on' or 'off' */
  value: Power;

  /** Transition style. Can be 'smooth' or 'sudden'. If undefined, set to 'smooth' */
  effect?: Effect;

  /** Transition time in milliseconds.
   * Ignored when effect is 'sudden'. If undefined, set to 500 */
  duration?: number;

  /** Force device mode after power on. Set to 0 by default.
   *
   * 0: Default, 1: ColorTemperature, 2: RGB, 3: HSV, 4: ColorFlow, 5: NightLight
   */
  mode?: PowerOnMode;
}

/** Toggle the light on/off */
export interface ToggleInput {
  feature: Feature.toggle | Feature.bg_toggle | Feature.dev_toggle;
}

/** Set current state as default after power cycle */
export interface DefaultInput {
  feature: Feature.set_default | Feature.bg_set_default;
}

/** Start color flow with given sequence */
export interface StartFlowInput {
  feature: Feature.start_cf | Feature.bg_start_cf;

  /** Number of cycles before stop. If 0 or undefined, set to infinite. */
  count?: number;

  /** State after stop. Default is 1.
   *
   * 0: Recover to the state before, 1: Stop at the last position, 2: Turn off the light */
  action?: AfterFlowAction;

  /** Multiple steps array */
  steps: FlowStep[];
}

/** Stop color flow */
export interface StopFlowInput {
  feature: Feature.stop_cf | Feature.bg_stop_cf;
}

/** Set state even if device is off */
export interface SceneInput {
  feature: Feature.set_scene | Feature.bg_set_scene;

  /** Brightness in percent: 0 ~ 100 */
  brightness: number;

  /** Command to be executed as a scene */
  command:
    | RgbInput
    | HsvInput
    | ColorTempInput
    | StartFlowInput
    | OffDelayInput;
}

/** Set auto-power-off timer */
export interface OffDelayInput {
  feature: Feature.cron_add;

  /** Number of minutes before off (1 ~ 60) */
  minutes: number;
}

/** Cancel auto-power-off timer */
export interface ClearOffDelayInput {
  feature: Feature.cron_del;
}

/** Increase/decrease selected parameter */
export interface AdjustInput {
  feature: Feature.set_adjust | Feature.bg_set_adjust;
  action: AdjustAction;
  prop: AdjustProp;
}

/** Set device name */
export interface NameInput {
  feature: Feature.set_name;
  name: string;
}

/** Change brightness by value */
export interface AdjustBrightInput {
  feature: Feature.adjust_bright | Feature.bg_adjust_bright;

  /** Adjust value: -100 ~ 100 */
  percentage: number;

  /** Transition time in milliseconds.
   * If undefined, set to 500 */
  duration?: number;
}

/** Change color temperature by value */
export interface AdjustColorTempInput {
  feature: Feature.adjust_ct | Feature.bg_adjust_ct;

  /** Adjust value: -100 ~ 100 */
  percentage: number;

  /** Transition time in milliseconds.
   * If undefined, set to 500 */
  duration?: number;
}

/** Change color by value */
export interface AdjustColorInput {
  feature: Feature.adjust_color | Feature.bg_adjust_color;

  /** Transition time in milliseconds.
   * If undefined, set to 500 */
  duration?: number;
}
