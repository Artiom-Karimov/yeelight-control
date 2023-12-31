import { EventEmitter } from 'node:events';
import { Socket } from 'node:net';
import { ExponentialBackoff } from './exponential-backoff';

export enum TelnetEvent {
  data = 'data',
  connect = 'connect',
  error = 'error',
  close = 'close',
}

export class TelnetClient {
  private socket?: Socket;
  private _connected = false;
  private emitter = new EventEmitter();
  private backoff = new ExponentialBackoff();

  get connected(): boolean {
    return this._connected;
  }

  constructor(
    public readonly address: string,
    public readonly port: number,
    public readonly reconnect = true,
  ) {}

  connect(): TelnetClient {
    if (this.socket) return this;

    this.newSocket();
    this.backoff.reset();
    this.socket!.connect(this.port, this.address);

    return this;
  }

  disconnect(): TelnetClient {
    this.destroySocket();
    this.emitter.emit('close');
    return this;
  }

  send(data: string | object): void {
    if (typeof data !== 'string') data = JSON.stringify(data);
    if (!this.socket) return;

    this.socket.write(data + '\r\n');
  }

  on(event: TelnetEvent.data, cb: (data: string) => void): TelnetClient;
  on(event: TelnetEvent.connect, cb: () => void): TelnetClient;
  on(
    event: TelnetEvent.error,
    cb: (error: NodeJS.ErrnoException) => void,
  ): TelnetClient;
  on(event: TelnetEvent.close, cb: (hadError: boolean) => void): TelnetClient;
  on(event: TelnetEvent, cb: (...args: any[]) => void): TelnetClient {
    this.emitter.on(event, cb);
    return this;
  }
  removeListener(
    event: TelnetEvent,
    callback: (...args: any[]) => void,
  ): TelnetClient {
    this.emitter.removeListener(event, callback);
    return this;
  }

  private onError = (err: NodeJS.ErrnoException) => {
    console.log(JSON.stringify(err));
    if (this.reconnect) this.tryReconnect();
    this.emitter.emit(TelnetEvent.error, err);
  };
  private onConnect = (): void => {
    this._connected = true;
    this.backoff.reset();
    this.emitter.emit(TelnetEvent.connect);
  };
  private onClose = (hadError: boolean): void => {
    this._connected = false;
    this.emitter.emit(TelnetEvent.close, hadError);
  };
  private onData = (data: Buffer): void => {
    const lines = data.toString().trim().split('\r\n');
    for (const line of lines) {
      this.emitter.emit(TelnetEvent.data, line);
    }
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
    oldOne.removeListener('data', this.onData);
    oldOne.removeListener('close', this.onClose);
    oldOne.removeListener('connect', this.onConnect);
    oldOne.removeListener('error', this.onError);

    oldOne.end(() => {
      oldOne.destroy().unref();
    });
  }

  private tryReconnect(): void {
    this.newSocket();
    this.backoff.delayNext(() => {
      this.socket?.connect(this.port, this.address);
    });
  }
}
