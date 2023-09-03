import * as dgram from 'node:dgram';
import { Config } from '../config';
import { EventEmitter } from 'node:events';
import { DiscoveryData } from './discovery-data';
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

    const port = config.get('discoveryPort') as number;
    const address = config.get('discoveryHost') as string;

    this.socket.bind(port, address);
  }

  public sendRequest(): void {
    const port = this.config.get('discoveryPort') as number;
    const address = this.config.get('discoveryIp') as string;
    this.socket.send(discoverMessage, port, address);
  }

  private error(err: Error): void {
    this.emit('error', err);
  }

  private listening(): void {
    const multicastAddress = this.config.get('discoveryIp') as string;
    const multicastInterface = this.config.get('discoveryHost') as string;
    this.socket.addMembership(multicastAddress, multicastInterface);
    this.emit('listening');
  }

  private receive(data: Buffer): void {
    try {
      const device = new DiscoveryData(data.toString());
      this.list.update(device);
      this.emit('update', this.list.getAll());
    } catch (error) {
      return;
    }
  }
}

const discoverMessage =
  'M-SEARCH * HTTP/1.1\r\nMAN: "ssdp:discover"\r\nST: wifi_bulb\r\n';
