export class CommandId {
  private static readonly maxId = 65535;
  private static current = 0;

  private constructor() {
    return;
  }

  public static next(): number {
    CommandId.increment();
    return CommandId.current;
  }

  private static increment(): void {
    CommandId.current++;
    if (CommandId.current > CommandId.maxId) CommandId.current = 1;
  }
}
