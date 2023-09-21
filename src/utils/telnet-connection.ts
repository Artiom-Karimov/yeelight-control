import { Socket } from 'node:net';

export class TelnetConnection {
  private socket?: Socket;
  private _connected = false;

  get connected(): boolean {
    return this._connected;
  }

  constructor(
    public readonly address: string,
    public readonly port: number,
  ) {}

  async connect(timeout = 5000): Promise<TelnetConnection> {
    this.newSocket();
    return Promise.race([this.connectPromise(), this.timeout(timeout)]);
  }
  send(data: string | object): void {
    if (typeof data !== 'string') data = JSON.stringify(data);
    this.socket?.write(data + '\r\n');
  }

  private onError = (err: Error) => {
    console.error(err);
  };
  private onConnect = (): void => {
    console.log(`${this.address}:${this.port} connected`);
  };
  private onClose = (): void => {
    console.log(`${this.address}:${this.port} closed`);
  };
  private onData = (data: Buffer): void => {
    console.log(data.toString());
  };

  private newSocket(): void {
    this.destroySocket();

    this.socket = new Socket();
    this.socket.on('error', this.onError);
    this.socket.on('connect', this.onConnect);
    this.socket.on('close', this.onClose);
    this.socket.on('data', this.onData);
  }
  private destroySocket(): void {
    if (!this.socket) return;

    const oldOne = this.socket;
    this.socket = undefined;

    oldOne.removeListener('error', this.onError);
    oldOne.removeListener('connect', this.onConnect);
    oldOne.removeListener('close', this.onClose);
    oldOne.removeListener('data', this.onData);
    oldOne.end(() => oldOne.destroy());
  }

  private async connectPromise(): Promise<TelnetConnection> {
    return new Promise((resolve) => {
      this.socket?.connect(this.port, this.address, () => {
        resolve(this);
      });
    });
  }
  private async timeout(ms: number): Promise<never> {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
    throw new Error(`Connection to ${this.address}:${this.port} timed out`);
  }
}
