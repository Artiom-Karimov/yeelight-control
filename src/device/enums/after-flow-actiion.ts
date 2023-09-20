export enum AfterFlowAction {
  /** Recover to the state before the color flow started  */
  Recover = 0,

  /** Stay at the state when the flow is stopped */
  Stop = 1,

  /** Turn off the smart LED after the flow is stopped */
  Off = 2,
}
