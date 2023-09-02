import { Config } from './config';
import { Discovery } from './discovery';

export const start = () => {
  const config = new Config();
  const discovery = new Discovery(config);
};

start();
