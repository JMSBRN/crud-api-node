import dotenv from 'dotenv';
import { env } from 'process';
import cluster, { Worker } from 'cluster';
import os from 'os';
import { stdoutWrite } from '../helpers';
import createLoadBalancer from './loadBalancer.';
import createWorker from './worker';

dotenv.config();
const { PORT } = env;
const port = parseInt(PORT!, 10) || 5000;

const numCPUs = os.cpus().length;

export const clusterApp = () => {
  if (cluster.isPrimary) {
    const workers = [] as Worker[];

    // Fork workers
    for (let i = 0; i < numCPUs; i += 1) {
      const worker = cluster.fork({ PORT_WORKER: port + i + 1 });
      workers.push(worker);

      // Restart worker on exit
      worker.on('exit', () => {
        stdoutWrite(`Worker ${worker.process.pid} died. Restarting...`);
        const newWorker = cluster.fork();
        workers.splice(workers.indexOf(worker), 1, newWorker);
      });
    }

    createLoadBalancer(workers, port);
  } else {
    createWorker(parseInt(process.env.PORT_WORKER!, 10));
  }
};

export default clusterApp;
