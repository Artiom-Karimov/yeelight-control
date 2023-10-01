## Typescript-first library for controlling Yeelight devices over LAN (WiFi)

![Tests](https://github.com/Artiom-Karimov/yeelight-control/actions/workflows/run-tests.yml/badge.svg?branch=master)
![Build](https://github.com/Artiom-Karimov/yeelight-control/actions/workflows/build.yml/badge.svg?branch=master)
<a href="https://www.npmjs.com/package/yeelight-control">![npm](https://img.shields.io/npm/v/yeelight-control)</a>

### Supported features:

- Discovery over multicast
- Connecting devices using discovered data or by known IP:Port
- Automatic device reconnect on network failure or device power cycle
- Event-driven architecture
- Command library (no need to memorize protocol details)
- Background light control features
- Zero external dependencies
- Both CommonJS and ESModule supported (require/import)

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

#### Do some random stuff

```typescript
const ip = '192.168.88.22';
const yeelight = new Yeelight({ disableDiscovery: true });
const device = yeelight.connectOne(ip);

// do nothing for ms milliseconds
const wait = async (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// do some random stuff
const sequence = async () => {
  device.command(CommandLibrary.powerOn());

  await wait(500);
  device.command(CommandLibrary.setBright(100));
  device.command(CommandLibrary.setRgb(0x0099ff));

  await wait(1000);
  device.command(CommandLibrary.setBright(50));
  device.command(CommandLibrary.setRgb(0xff9900));

  await wait(1000);
  device.command(CommandLibrary.powerOff);

  await wait(50);
  device.disconnect();

  await wait(5000);
  device.connect();
};

device.on('connect', sequence);
device.on('connect', () => console.log('connected'));
device.on('disconnect', () => console.log('disconnected'));
```
