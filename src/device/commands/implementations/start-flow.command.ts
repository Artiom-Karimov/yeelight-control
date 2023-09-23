import { Device } from '../../device';
import { StartFlowInput } from '../../dto/command-input';
import { YeelightFlowExpression } from 'src/utils/flow-expression';
import { AfterFlowAction } from '../../enums/after-flow-actiion';
import { BaseCommand } from '../base-command';
import { CommandData } from '../command';
import { Feature } from '../../enums/feature';

/** Flow command params for telnet */
export type FlowParams = [
  count: number,
  action: AfterFlowAction,
  expression: string,
];

export class StartFlowCommand extends BaseCommand {
  private readonly expression: YeelightFlowExpression;

  constructor(
    device: Device,
    { count, action, steps, feature }: StartFlowInput,
  ) {
    super(device, feature);
    this.expression = new YeelightFlowExpression(steps, count, action);
  }

  get data(): CommandData {
    return {
      id: this._id,
      method: this._feature,
      params: this.expression.params,
    };
  }

  protected feedback(): void {
    if (this.feature === Feature.start_cf)
      return this.device.update({ flow_params: this.expression });
    if (this.feature === Feature.bg_start_cf)
      return this.device.update({ bg_flow_params: this.expression });
  }
}
