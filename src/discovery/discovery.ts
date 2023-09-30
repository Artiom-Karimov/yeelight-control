import * as dgram from 'node:dgram';
import { Config } from '../config';
import { EventEmitter } from 'node:events';
import { DiscoveredList } from './discovered-list';

export class Discovery extends EventEmitter {
  private socket: dgram.Socket;

  constructor(
    private readonly config: Config,
    private readonly list: DiscoveredList,
  ) {
    super();

    this.socket = dgram.createSocket('udp4');
    this.socket.on('error', (err) => this.error(err));
    this.socket.on('listening', () => this.listening());
    this.socket.on('message', (data) => this.receive(data));

    const port = config.get<number>('discoveryPort');
    const address = config.get<string>('discoveryHost');

    this.socket.bind(port, address);
  }

  public sendRequest(): void {
    const port = this.config.get<number>('discoveryPort');
    const address = this.config.get<string>('discoveryIp');
    this.socket.send(discoverMessage, port, address);
  }

  private error(err: Error): void {
    // TODO: Implement reconnect procedure
    this.emit('error', err);
  }

  private listening(): void {
    const multicastAddress = this.config.get<string>('discoveryIp');
    const multicastInterface = this.config.get<string>('discoveryHost');
    this.socket.addMembership(multicastAddress, multicastInterface);
    this.sendRequest();
    this.emit('listening');
  }

  private receive(data: Buffer): void {
    try {
      this.list.update(data.toString());
      this.emit('update', this.list.getAll());
    } catch (error) {
      return;
    }
  }
}

const discoverMessage =
  'M-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n';
