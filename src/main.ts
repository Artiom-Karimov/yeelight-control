import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Yeelight } from './yeelight';

export const start = () => {
  const yeelight = new Yeelight();

  yeelight.on(
    'discovery',
    async (data) =>
      await writeFile(
        resolve(__dirname, '..', 'test-files', `${Date.now()}.json`),
        JSON.stringify(data, undefined, 2),
      ),
  );
};

start();
