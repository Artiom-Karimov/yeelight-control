import { AfterFlowAction } from '../enums/after-flow-actiion';
import { ColorMode } from '../enums/color-mode';

export type FlowParams = [
  count: number,
  action: AfterFlowAction,
  expression: string,
];

export class FlowExpression {
  constructor(
    public steps: FlowStep[],
    public rounds = 0,
    public action = AfterFlowAction.Stop,
  ) {}

  static fromFeedback(params: FlowParams): FlowExpression {
    const steps = FlowStep.fromFeedback(params[2]);
    return new FlowExpression(steps, params[0], params[1]);
  }

  get params(): FlowParams {
    const lines = this.steps.map((s) => s.line);
    const expression = lines.join(',');
    return [this.rounds, this.action, expression];
  }
}

export class FlowStep {
  constructor(
    public duration: number,
    public mode: ColorMode,
    public value: number,
    public brightness: number,
  ) {}

  static fromFeedback(expression: string): Array<FlowStep> {
    const elements = expression.split(',');
    if (!elements.length || elements.length % 4 !== 0)
      throw new Error(`Illegal flow expression: ${expression}`);

    const result = new Array<FlowStep>();
    while (elements.length > 3) {
      const duration = +elements.shift()!;
      const mode = +elements.shift()!;
      const value = +elements.shift()!;
      const brightness = +elements.shift()!;
      result.push(new FlowStep(duration, mode, value, brightness));
    }

    return result;
  }

  get line(): string {
    return `${this.duration},${this.mode},${this.value},${this.brightness}`;
  }
}
