import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Yeelight } from './yeelight';
import { TelnetConnection } from './utils/telnet-connection';
import { PowerCommand } from './device/commands/implementations/power.command';
import { Power } from './device/enums/power';

// export const start = () => {
//   const yeelight = new Yeelight();

//   yeelight.on(
//     'discovery',
//     async (data) =>
//       await writeFile(
//         resolve(__dirname, '..', 'test-files', `${Date.now()}.json`),
//         JSON.stringify(data, undefined, 2),
//       ),
//   );
// };
const start = async () => {
  const client = new TelnetConnection('192.168.88.23', 55443);
  await client.connect();
  console.log('Connect from main');
  const command = new PowerCommand(null as any, Power.off);
  client.send(command.data);
};

start();
