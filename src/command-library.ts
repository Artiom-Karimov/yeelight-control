import { PowerOnMode } from './device/commands/implementations/power.command';
import {
  PowerInput,
  ColorTempInput,
  ToggleInput,
  RgbInput,
  HsvInput,
  BrightInput,
  DefaultInput,
  StartFlowInput,
  StopFlowInput,
  NameInput,
  SceneInput,
  OffDelayInput,
  ClearOffDelayInput,
  AdjustInput,
  AdjustBrightInput,
  AdjustColorTempInput,
  AdjustColorInput,
} from './device/dto/command-input';
import { FlowStep } from './device/dto/flow-expression';
import { AfterFlowAction } from './device/enums/after-flow-actiion';
import { Feature } from './device/enums/feature';
import { AdjustAction, AdjustProp, Effect } from './device/enums/string-values';

/** Contains convenient aliases for all supported features */
export class CommandLibrary {
  //#region ColorTemp

  /** Color temperature value (1700 ~ 6500) */
  static setColorTemp(
    value: number,
    effect?: Effect,
    duration?: number,
  ): ColorTempInput {
    return {
      feature: Feature.set_ct_abx,
      value,
      effect,
      duration,
    };
  }
  /** Background color temperature value (1700 ~ 6500) */
  static setColorTempBg(
    value: number,
    effect?: Effect,
    duration?: number,
  ): ColorTempInput {
    return {
      feature: Feature.bg_set_ct_abx,
      value,
      effect,
      duration,
    };
  }

  //#endregion

  //#region RGB

  /** RGB value (0 ~ 0xFFFFFF) */
  static setRgb(value: number, effect?: Effect, duration?: number): RgbInput {
    return {
      feature: Feature.set_rgb,
      value,
      effect,
      duration,
    };
  }
  /** Background RGB value (0 ~ 0xFFFFFF) */
  static setRgbBg(value: number, effect?: Effect, duration?: number): RgbInput {
    return {
      feature: Feature.bg_set_rgb,
      value,
      effect,
      duration,
    };
  }

  //#endregion

  //#region HSV

  /** Hue/saturation values
   * @param hue 0-359
   * @param sat 0-100
   */
  static setHsv(
    hue: number,
    sat: number,
    effect?: Effect,
    duration?: number,
  ): HsvInput {
    return {
      feature: Feature.set_hsv,
      hue,
      sat,
      effect,
      duration,
    };
  }
  /** Background hue/saturation values
   * @param hue 0-359
   * @param sat 0-100
   */
  static setHsvBg(
    hue: number,
    sat: number,
    effect?: Effect,
    duration?: number,
  ): HsvInput {
    return {
      feature: Feature.bg_set_hsv,
      hue,
      sat,
      effect,
      duration,
    };
  }

  //#endregion

  //#region Power

  /** Turn on main light.
   * @param [mode] Turn on to specific mode.
   * Normal = 0,
   * ColorTemperature = 1,
   * RGB = 2,
   * HSV = 3,
   * ColorFlow = 4,
   * NightLight = 5,
   */
  static powerOn(mode?: PowerOnMode): PowerInput {
    return {
      feature: Feature.set_power,
      value: 'on',
      mode,
    };
  }

  /** Turn on background light */
  static powerOnBg: PowerInput = {
    feature: Feature.bg_set_power,
    value: 'on',
  };

  /** Turn off main light */
  static powerOff: PowerInput = {
    feature: Feature.set_power,
    value: 'off',
  };

  /** Turn off background light */
  static powerOffBg: PowerInput = {
    feature: Feature.bg_set_power,
    value: 'off',
  };

  /** Toggle on/off main light */
  static toggle: ToggleInput = {
    feature: Feature.toggle,
  };

  /** Toggle on/off background light */
  static toggleBg: ToggleInput = {
    feature: Feature.bg_toggle,
  };

  /** Toggle on/off both devices (for 2-region devices) */
  static toggleBoth: ToggleInput = {
    feature: Feature.dev_toggle,
  };

  //#endregion

  //#region Bright

  /** Set brightness level (0 ~ 100) */
  static setBright(
    value: number,
    effect?: Effect,
    duration?: number,
  ): BrightInput {
    return {
      feature: Feature.set_bright,
      value,
      effect,
      duration,
    };
  }

  /** Set background brightness level (0 ~ 100) */
  static setBrightBg(
    value: number,
    effect?: Effect,
    duration?: number,
  ): BrightInput {
    return {
      feature: Feature.bg_set_bright,
      value,
      effect,
      duration,
    };
  }

  //#endregion

  //#region Default

  /** Set current state as default after power cycle */
  static setDefault: DefaultInput = {
    feature: Feature.set_default,
  };

  /** Set current background state as default after power cycle */
  static setDefaultBg: DefaultInput = {
    feature: Feature.bg_set_default,
  };

  //#endregion

  //#region ColorFlow

  /** Start color flow with given sequence.
   * @param steps Flow sequence
   * @param [count] Number of cycles before stop. If 0 or undefined, set to infinite.
   * @param [action] State after stop. Default is 1. 0: Recover to the state before, 1: Stop at the last position, 2: Turn off the light
   * @example
   * CommandLibrary.startColorFlow([
   *  {
   *    duration: 1000,
   *    mode: FlowStepMode.rgb,
   *    value: 0x00ff00,
   *    brightness: 80,
   *  },
   *  {
   *    duration: 2000,
   *    mode: FlowStepMode.colorTemp,
   *    value: 2700,
   *    brightness: 30,
   *  },
   *  {
   *    duration: 5000,
   *    mode: FlowStepMode.sleep,
   *    value: 0,
   *    brightness: 50
   *  },
   * ], 3, AfterFlowAction.Off);
   */
  static startColorFlow(
    steps: FlowStep[],
    count?: number,
    action?: AfterFlowAction,
  ): StartFlowInput {
    return {
      feature: Feature.start_cf,
      count,
      action,
      steps: [...steps],
    };
  }

  /** Start background color flow with given sequence.
   * @param steps Flow sequence
   * @param [count] Number of cycles before stop. If 0 or undefined, set to infinite.
   * @param [action] State after stop. Default is 1. 0: Recover to the state before, 1: Stop at the last position, 2: Turn off the light
   * @example
   * CommandLibrary.startColorFlowBg([
   *  {
   *    duration: 1000,
   *    mode: FlowStepMode.rgb,
   *    value: 0x00ff00,
   *    brightness: 80,
   *  },
   *  {
   *    duration: 2000,
   *    mode: FlowStepMode.colorTemp,
   *    value: 2700,
   *    brightness: 30,
   *  },
   *  {
   *    duration: 5000,
   *    mode: FlowStepMode.sleep,
   *    value: 0,
   *    brightness: 50
   *  },
   * ], 3, AfterFlowAction.Off);
   */
  static startColorFlowBg(
    steps: FlowStep[],
    count?: number,
    action?: AfterFlowAction,
  ): StartFlowInput {
    return {
      feature: Feature.bg_start_cf,
      count,
      action,
      steps: [...steps],
    };
  }

  /** Stop color flow */
  static stopColorFlow: StopFlowInput = {
    feature: Feature.stop_cf,
  };

  /** Stop background color flow */
  static stopColorFlowBg: StopFlowInput = {
    feature: Feature.bg_stop_cf,
  };

  //#endregion

  //#region Scene

  /** Set state even if device is off.
   * @param brightness Set brightness 0 ~ 100
   * @param command launch sub-command
   * @example
   * CommandLibrary.scene(45, CommandLibrabry.setRgb(0xff9900))
   */
  static scene(
    brightness: number,
    command:
      | RgbInput
      | HsvInput
      | ColorTempInput
      | StartFlowInput
      | OffDelayInput,
  ): SceneInput {
    return {
      feature: Feature.set_scene,
      brightness,
      command,
    };
  }

  /** Set background state even if device is off.
   * @param brightness Set brightness 0 ~ 100
   * @param command launch sub-command
   * @example
   * CommandLibrary.scene(45, CommandLibrabry.setRgbBg(0xff9900))
   */
  static sceneBg(
    brightness: number,
    command:
      | RgbInput
      | HsvInput
      | ColorTempInput
      | StartFlowInput
      | OffDelayInput,
  ): SceneInput {
    return {
      feature: Feature.bg_set_scene,
      brightness,
      command,
    };
  }

  //#endregion

  //#region OffDelay

  /** Set auto-power-off timer.
   * @param minutes Time before off (1 ~ 60)
   */
  static offDelay(minutes: number): OffDelayInput {
    return {
      feature: Feature.cron_add,
      minutes,
    };
  }

  /** Cancel auto-power-off timer */
  static clearOffDelay: ClearOffDelayInput = {
    feature: Feature.cron_del,
  };

  //#endregion

  //#region Adjust

  /** Increase/decrease selected parameter.
   * Note: if mode is 'color', action has to be 'circle'.
   * @param action 'increase' | 'decrease' | 'circle'
   * @param prop 'bright' | 'ct' | 'color'
   */
  static adjust(action: AdjustAction, prop: AdjustProp): AdjustInput {
    return {
      feature: Feature.set_adjust,
      action,
      prop,
    };
  }

  /** Increase/decrease selected background parameter.
   * Note: if mode is 'color', action has to be 'circle'.
   * @param action 'increase' | 'decrease' | 'circle'
   * @param prop 'bright' | 'ct' | 'color'
   */
  static adjustBg(action: AdjustAction, prop: AdjustProp): AdjustInput {
    return {
      feature: Feature.bg_set_adjust,
      action,
      prop,
    };
  }

  /** Increase/decrease brightness by percent.
   * @param percentage Can be -100 to 100
   * @param [duration] Time to gradually change
   */
  static adjustBright(
    percentage: number,
    duration?: number,
  ): AdjustBrightInput {
    return {
      feature: Feature.adjust_bright,
      percentage,
      duration,
    };
  }

  /** Increase/decrease background brightness by percent.
   * @param percentage Can be -100 to 100
   * @param [duration] Time to gradually change
   */
  static adjustBrightBg(
    percentage: number,
    duration?: number,
  ): AdjustBrightInput {
    return {
      feature: Feature.bg_adjust_bright,
      percentage,
      duration,
    };
  }

  /** Increase/decrease color temperature by percent.
   * @param percentage Can be -100 to 100
   * @param [duration] Time to gradually change
   */
  static adjustColorTemp(
    percentage: number,
    duration?: number,
  ): AdjustColorTempInput {
    return {
      feature: Feature.adjust_ct,
      percentage,
      duration,
    };
  }

  /** Increase/decrease background color temperature by percent.
   * @param percentage Can be -100 to 100
   * @param [duration] Time to gradually change
   */
  static adjustColorTempBg(
    percentage: number,
    duration?: number,
  ): AdjustColorTempInput {
    return {
      feature: Feature.bg_adjust_ct,
      percentage,
      duration,
    };
  }

  /** Move to next basic color.
   * @param [duration] Time to gradually change
   */
  static adjustColor(duration?: number): AdjustColorInput {
    return {
      feature: Feature.adjust_color,
      duration,
    };
  }

  /** Move background to next basic color.
   * @param [duration] Time to gradually change
   */
  static adjustColorBg(duration?: number): AdjustColorInput {
    return {
      feature: Feature.bg_adjust_color,
      duration,
    };
  }

  //#endregion

  /** Set device name */
  static setName(name: string): NameInput {
    return {
      feature: Feature.set_name,
      name,
    };
  }
}
