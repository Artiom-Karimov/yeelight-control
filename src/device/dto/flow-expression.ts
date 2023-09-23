import { AfterFlowAction } from '../enums/after-flow-actiion';

export enum FlowStepMode {
  /** RGB value */
  rgb = 1,
  /** ColorTemperature value */
  temperature = 2,
  /** Wait for specified duration */
  sleep = 7,
}

/** Representation of flow sequence */
export interface FlowExpression {
  /** Number of cycles before stop. 0 means infinite. */
  readonly count: number;

  /** State after stop. Default is 1.
   *
   * 0: Recover to the state before, 1: Stop at the last position, 2: Turn off the light */
  readonly action: AfterFlowAction;

  /** Multiple steps array */
  readonly steps: FlowStep[];
}

/** Color flow step */
export interface FlowStep {
  /** Step time in milliseconds */
  readonly duration: number;

  /** Step mode.
   *
   * 1: RGB, 2: ColorTemperature, 7: Sleep
   */
  readonly mode: FlowStepMode;

  /** Mode-specific value.
   * 0 ~ 0xFFFFFF for RGB, 1700 ~ 6500 for ColorTemperature, always 0 for sleep  */
  readonly value: number;

  /** Brightness in percent: 0 ~ 100 */
  readonly brightness: number;
}
