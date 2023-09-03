import { DeviceData } from '../device/device-data';

export class DiscoveredList {
  private readonly _map = new Map<number, DeviceData>();

  public update(device: DeviceData): void {
    this._map.set(device.id, device);
  }

  public get(id: number): DeviceData | undefined {
    return this._map.get(id);
  }
  public getAll(): DeviceData[] {
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
  private sortByDate(a: DeviceData, b: DeviceData): number {
    if (a.updatedAt > b.updatedAt) return -1;
    if (a.updatedAt < b.updatedAt) return 1;
    return 0;
  }
}
