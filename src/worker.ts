import { createServer, IncomingHttpHeaders, request } from 'http';
import routes from './routes/routes';
import { stdoutWrite } from './utils';

export default function createWorker(port: number) {
  const server = createServer((req, res) => {
    stdoutWrite(`worker pid ${process.pid}, method ${JSON.stringify(req.method)} port: ${JSON.stringify(port)}`);
    routes(req, res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
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
