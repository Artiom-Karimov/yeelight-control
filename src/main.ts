import { Config } from './config';
import { DiscoveredList } from './discovery/discovered-list';
import { Discovery } from './discovery/discovery';
import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export const start = () => {
  const config = new Config();
  const list = new DiscoveredList();
  const discovery = new Discovery(config, list);
  discovery.on('listening', () => discovery.sendRequest());

  discovery.on(
    'update',
    async (data) =>
      await writeFile(
        resolve(__dirname, '..', 'test-files', `${Date.now()}.json`),
        JSON.stringify(data, undefined, 2),
      ),
  );
};

start();
