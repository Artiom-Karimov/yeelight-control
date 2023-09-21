import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { Yeelight } from './yeelight';
import { TelnetClient, TelnetEvent } from './utils/telnet-client';
import { ToggleCommand } from './device/commands/implementations/toggle.command';
import { connect } from 'node:http2';

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
const toggle = (client: TelnetClient) => {
  const command = new ToggleCommand(null as any);
  client.send(command.data);
};

const start = async () => {
  const client = new TelnetClient('192.168.88.23', 55443);
  let interval: NodeJS.Timeout;

  client
    .on(TelnetEvent.data, (data) => console.log(data))
    .on(TelnetEvent.error, (err) => {
      console.log(err);
      clearInterval(interval);
    })
    .on(TelnetEvent.close, () => console.log('closed'))
    .on(TelnetEvent.connect, () => {
      interval = setInterval(() => toggle(client), 5000);
    });

  client.connect();
};

start();
