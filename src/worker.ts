import http from 'http';
import { stdoutWrite } from './utils';

export default function createWorker(port: number) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('hello');
  });

  process.on('message', (message: { method: string; url: string; headers: http.IncomingHttpHeaders }) => {
    // Forward request to local server
    const req = http.request({
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
    stdoutWrite(`Worker listening on port ${port}`);
  });
}
