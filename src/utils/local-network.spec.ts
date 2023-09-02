import { LocalNetwork } from './local-network';

describe('LocalNetwork utils tests', () => {
  it('local ip should exist and not be loopback', () => {
    const address = LocalNetwork.getLocalIp();
    expect(address).toBeTruthy();
    expect(typeof address).toBe('string');
    expect(address!.startsWith('127')).toBe(false);
    expect(address).toContain('.');
  });
});
