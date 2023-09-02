import { networkInterfaces } from 'node:os';

type AddressInfo = {
  address: string;
  netmask: string;
  family: 'IPv6' | 'IPv4';
  mac: string;
  internal: boolean;
};

export class LocalNetwork {
  public static getLocalIp(): string | null {
    const all = networkInterfaces();

    for (const key in all) {
      const addresses = all[key];
      const address = LocalNetwork.extractIp(addresses as any);
      if (address) return address;
    }

    return null;
  }

  private static extractIp(addresses: AddressInfo[]): string | null {
    for (const item of addresses) {
      if (item.internal || item.family === 'IPv6' || !item.address) continue;
      if (item.address.startsWith('127')) continue;

      return item.address;
    }

    return null;
  }
}
