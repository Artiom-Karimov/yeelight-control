export class CommandId {
  private static current = 0;

  private constructor() {
    return;
  }

  public static next(): number {
    let next = CommandId.current;
    next++;
    if (next > 65535) next = 1;
    CommandId.current = next;
    return next;
  }
}
