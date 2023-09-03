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
    this.emit('error', err);
  }

  private listening(): void {
    this.socket.addMembership(
      this.config.discoveryIp,
      this.config.discoveryHost,
    );
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
