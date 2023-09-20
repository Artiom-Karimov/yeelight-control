export class Response {
  public readonly id: number;
  public readonly result?: Array<string>;
  public readonly error?: ResponseError;

  constructor(raw: string) {
    const data = JSON.parse(raw);
    if (!data.id || isNaN(+data.id))
      throw new Error(`No id in response: ${raw}`);

    this.id = +data.id;
    if (data.result && data.result.length) this.result = data.result;
    if (data.error) this.error = data.error;
  }

  get success(): boolean {
    return this.error == null && this.result != null;
  }
}

export type ResponseError = {
  code: number;
  message: string;
};
