## Typescript-first library for controlling Yeelight devices over LAN (WiFi)

![Tests](https://github.com/Artiom-Karimov/yeelight-control/actions/workflows/run-tests.yml/badge.svg)
<a href="https://www.npmjs.com/package/yeelight-control">![npm](https://img.shields.io/npm/v/yeelight-control)</a>

### Supported features:

- Discovery over multicast
- Connecting devices using discovered data or by known IP:Port
- Automatic device reconnect on network failure or device power cycle
- Event-driven architecture
- Command library (no need to memorize protocol details)

### Examples

#### Connect device by known IP and power on

```typescript
const ip = '192.168.1.100';

const powerOn = (device: Device) => {
  device.command(CommandLibrary.powerOn());
};
const printStatus = (state: DeviceState) => {
  console.log(`Power: ${state.power}`);
};

const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne(ip);

  device.on('connect', () => powerOn(device));
  device.on('update', printStatus);
};

start();
```

#### Connect discovered devices

```typescript
const connectedDevices = new Set<Device>();

/* Function will be called several times with overlapping devices,
 * but yeelight will return already existing ones if you'll try to connect them again.
 * The 0st element is always the newest discovered. */
const add = (data: DiscoveryData[], yeelight: Yeelight): void => {
  const device = yeelight.connectDiscovered(data[0]);
  connectedDevices.add(device);

  console.log('Connected devices:');
  for (const device of connectedDevices) {
    console.log(`${device.ip}`);
  }
};

const start = () => {
  const yeelight = new Yeelight();
  yeelight.on('discovery', (data) => add(data, yeelight));
};

start();
```

#### Cycle through all basic colors

```typescript
const ip = '192.168.88.22';

const effect = (device: Device) => {
  device.command(CommandLibrary.powerOn(PowerOnMode.RGB));
  // adjustColor will switch the light to one of basic predefined colors.
  // 5000 is tansition  duration in ms
  setInterval(() => device.command(CommandLibrary.adjustColor(5000)), 5000);
};

const printColor = (data: DeviceState): void => {
  const color = data.rgb?.toString(16).padStart(6, '0');
  console.log(`Color: #${color}`);
};

const start = () => {
  const yeelight = new Yeelight();
  const device = yeelight.connectOne(ip);
  device.on('connect', () => effect(device)).on('update', printColor);
};

start();
```
