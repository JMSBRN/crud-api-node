import cluster from 'cluster';
import { cpus } from 'os';
import process from 'process';
import server from './index';
import { stdoutWrite } from './utils';

const numCPUs = cpus().length;

if (cluster.isPrimary) {
  stdoutWrite(`Primary ${process.pid} is running \n`);
  server.listen(4000);
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
    server.listen(4000 + num);
  });
  if (process.send) {
    process.send('');
  }
}
