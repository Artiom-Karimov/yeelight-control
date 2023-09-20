import { Param } from '../enums/param';
import { Notification } from './notification';

describe('Notification parsing tests', () => {
  test('Invalid data should throw', () => {
    let data = '';

    const shouldThrow = () => {
      new Notification(data);
    };

    expect(shouldThrow).toThrowError();
    data = 'abc';
    expect(shouldThrow).toThrowError();
    data = '{}';
    expect(shouldThrow).toThrowError();
    data = '[]';
    expect(shouldThrow).toThrowError();
    data = '{"params":{"power":"on"}}';
    expect(shouldThrow).toThrowError();
    data = '{"method":"props"}\r\n';
    expect(shouldThrow).toThrowError();
    data = '{"id":3,"result":["ok"]}\r\n';
    expect(shouldThrow).toThrowError();
  });

  test('Valid notification should be parsed', () => {
    const data = {
      method: 'props',
      params: {
        power: 'on',
        bright: '10',
      },
    };

    const notification = new Notification(JSON.stringify(data) + '\r\n');
    const state = notification.state;

    expect(state[Param.power]).toBe(data.params.power);
    expect(state[Param.bright]).toBe(+data.params.bright);
  });
});
