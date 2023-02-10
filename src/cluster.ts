import cluster from 'cluster';
import http from 'http';
import { cpus } from 'os';
import process from 'process';
import { stdoutWrite } from './utils';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  stdoutWrite(`Primary ${process.pid} is running \n`);

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }
  cluster.on('message', (workers, message) => {
    workers.send(`${workers.id}`);
    stdoutWrite(`${message}\n`);
  });
  cluster.on('exit', (worker) => {
    stdoutWrite(`worker ${worker.process.pid} died`);
  });
  cluster.on('listening', (worker, address) => {
    stdoutWrite(`worker id ${worker.id} ${worker.process.pid} is now connected to ${address.port}\n`);
  });
} else {
  process.on('message', (msg: string) => {
    const num = Number(msg);
    http.createServer((req, res) => {
      res.writeHead(200);
      res.end('hello world\n');
    }).listen(4000 + num);
  });
  if (process.send) {
    process.send('');
  }
}
