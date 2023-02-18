import cluster from 'cluster';
import { createServer } from 'http';
import { cpus } from 'os';
import process from 'process';
import serverWorker from './index';
import { stdoutWrite } from './utils';

const numCPUs = cpus().length;
let nextWorker = 0;

if (cluster.isPrimary) {
  stdoutWrite(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i += 1) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    stdoutWrite(`Worker ${worker.process.pid} died with code ${code} and signal ${signal}`);
    stdoutWrite('Starting a new worker');
    cluster.fork();
  });

  const server = createServer((req, res) => {
    const worker = cluster.workers![nextWorker];
    if (worker) {
      worker.send({ type: 'request' });
      nextWorker = (nextWorker + 1) % numCPUs;
    } else {
      res.statusCode = 500;
      res.end('No available workers');
    }
  });

  server.listen(4000);
} else {
  process.on('message', (msg: { type: string }) => {
    if (msg.type === 'request') {
      const workerId = cluster.worker?.id || 0;
      serverWorker.listen(4001 + workerId, () => {
        if (serverWorker) {
          if (serverWorker.address() !== null) {
            stdoutWrite(`Worker ${process.pid} is running`);
          }
        }
      });
    }
  });
}
