import {
  FlowExpression,
  FlowStep,
  FlowStepMode,
} from 'src/device/dto/flow-expression';
import { FlowParams } from '../device/commands/implementations/start-flow.command';
import { AfterFlowAction } from '../device/enums/after-flow-actiion';

export class YeelightFlowExpression implements FlowExpression {
  private readonly _steps: YeelightFlowStep[];

  constructor(
    steps: FlowStep[],
    public readonly count = 0,
    public readonly action = AfterFlowAction.Stop,
  ) {
    this._steps = YeelightFlowStep.fromDtos(steps);
  }

  static fromFeedback(params: FlowParams): YeelightFlowExpression {
    const steps = YeelightFlowStep.fromFeedback(params[2]);
    return new YeelightFlowExpression(steps, params[0], params[1]);
  }

  get steps(): FlowStep[] {
    return this._steps.map((s) => s.toDto());
  }

  /** Param array for telnet */
  get params(): FlowParams {
    const lines = this._steps.map((s) => s.toLine());
    const expression = lines.join(',');
    return [this.count, this.action, expression];
  }
}

class YeelightFlowStep implements FlowStep {
  public readonly duration: number;
  public readonly mode: FlowStepMode;
  public readonly value: number;
  public readonly brightness: number;

  constructor({ duration, mode, value, brightness }: FlowStep) {
    this.duration = duration;
    this.mode = mode;
    this.value = value;
    this.brightness = brightness;
  }

  static fromDtos(dtos: FlowStep[]): YeelightFlowStep[] {
    return dtos.map((dto) => new YeelightFlowStep(dto));
  }

  static fromFeedback(expression: string): Array<YeelightFlowStep> {
    const elements = expression.split(',');
    if (!elements.length || elements.length % 4 !== 0)
      throw new Error(`Illegal flow expression: ${expression}`);

    const result = new Array<YeelightFlowStep>();
    while (elements.length > 3) {
      const duration = +elements.shift()!;
      const mode = +elements.shift()!;
      const value = +elements.shift()!;
      const brightness = +elements.shift()!;
      result.push(new YeelightFlowStep({ duration, mode, value, brightness }));
    }

    return result;
  }

  public toDto(): FlowStep {
    return {
      duration: this.duration,
      mode: this.mode,
      value: this.value,
      brightness: this.brightness,
    };
  }

  public toLine(): string {
    return `${this.duration},${this.mode},${this.value},${this.brightness}`;
  }
}
