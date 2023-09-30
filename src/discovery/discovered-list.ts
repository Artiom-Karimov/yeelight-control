import { DiscoveryData } from './discovery-data';
import { YeelightDiscoveryData } from './yeelight-discovery-data';

export class DiscoveredList {
  private readonly _map = new Map<number, DiscoveryData>();

  public update(message: string): void {
    const device = new YeelightDiscoveryData(message);
    this._map.set(device.id, device.dto);
  }

  public get(id: number): DiscoveryData | undefined {
    return this._map.get(id);
  }
  public getAll(): DiscoveryData[] {
    this.removeExpired();
    return Array.from(this._map, (pair) => pair[1]).sort(this.sortByDate);
  }

  private removeExpired(): void {
    const toRemove: number[] = [];

    for (const device of this._map.values()) {
      if (device.expiresAt.getTime() < Date.now()) {
        toRemove.push(device.id);
      }
    }
    for (const id of toRemove) {
      this._map.delete(id);
    }
  }
  private sortByDate(a: DiscoveryData, b: DiscoveryData): number {
    if (a.updatedAt > b.updatedAt) return -1;
    if (a.updatedAt < b.updatedAt) return 1;
    return 0;
  }
}
