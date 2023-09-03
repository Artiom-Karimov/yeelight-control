import * as dgram from 'node:dgram';
import { Config } from './config';
import { EventEmitter } from 'node:events';
import { DeviceData } from './device/device-data';

export class Discovery extends EventEmitter {
  private socket: dgram.Socket;

  constructor(private readonly config: Config) {
    super();

    this.socket = dgram.createSocket('udp4');
    this.socket.on('error', (err) => this.error(err));
    this.socket.on('listening', () => this.listening());
    this.socket.on('close', () => this.emit('close'));
    this.socket.on('message', (data, rinfo) => this.receive(data, rinfo));

    this.socket.bind(config.discoveryPort, config.discoveryHost);
  }

  public sendRequest(): void {
    this.socket.send(
      discoverMessage,
      this.config.discoveryPort,
      this.config.discoveryIp,
    );
  }

  private error(err: Error): void {
    console.error(err);
  }

  private listening(): void {
    console.log(
      'listening',
      this.config.discoveryIp,
      this.config.discoveryPort,
    );
    this.socket.addMembership(
      this.config.discoveryIp,
      this.config.discoveryHost,
    );
    this.emit('listening');
  }

  private receive(data: Buffer, rinfo: any): void {
    try {
      const device = new DeviceData(data.toString());
      this.emit('update', device);
    } catch (error) {
      return;
    }
  }
}

const discoverMessage =
  'M-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n';
