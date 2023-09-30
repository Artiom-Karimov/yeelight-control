import { YeelightConfig } from './config';

describe('Config unit tests', () => {
  test('Should contin default settings on empty params', () => {
    const config = new YeelightConfig();

    const controlPort = config.get<number>('controlPort');
    expect(controlPort).toBe(55443);

    const disableDiscovery = config.get<boolean>('disableDiscovery');
    expect(disableDiscovery).toBe(false);

    const commandExpire = config.get<number>('commandExpire');
    expect(commandExpire).toBe(5000);
  });

  test('Config from params should override defaults', () => {
    const config = new YeelightConfig({
      discoveryHost: '10.0.0.64',
      discoveryPort: 987,
      commandExpire: 15_000,
    });

    const discoveryHost = config.get<string>('discoveryHost');
    expect(discoveryHost).toBe('10.0.0.64');

    const commandExpire = config.get<number>('commandExpire');
    expect(commandExpire).toBe(15_000);

    const controlPort = config.get<number>('controlPort');
    expect(controlPort).toBe(55443);
  });
});
