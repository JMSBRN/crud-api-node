import { fork } from 'child_process';
import { createServer, IncomingHttpHeaders, request } from 'http';
import { join } from 'path';
import { cwd } from 'process';
import { StatusCode } from '../constants';
import { stdoutWrite } from '../helpers';

export default function createWorker(port: number) {
  const child = fork(join(cwd(), 'src/data/', 'db.ts'));

  child.on('message', (msg: { type: string; data: number[] }) => {
    // eslint-disable-next-line no-console
    console.log('Received modified array from child:', msg);
  });

  const server = createServer((req, res) => {
    stdoutWrite(`worker pid ${process.pid}, method ${JSON.stringify(req.method)} port: ${JSON.stringify(port)}`);
    child.send({ type: req.method });
    res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
    res.end();
  });

  process.on('message', (message: { method: string; url: string; headers: IncomingHttpHeaders }) => {
    const req = request({
      method: message.method, path: message.url, headers: message.headers, port,
    }, (res) => {
      // Ignore response
      res.resume();
    });

    req.on('error', (err) => {
      stdoutWrite(`${err}`);
    });

    req.end();
  });

  server.listen(port, () => {
    stdoutWrite(`Worker pid ${process.pid} listening on port ${port}`);
  });
}
