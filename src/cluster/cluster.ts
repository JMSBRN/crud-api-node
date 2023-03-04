import dotenv from 'dotenv';
import { env } from 'process';
import cluster, { Worker } from 'cluster';
import os from 'os';
import server from '../server';
import { checkArgValue, stdoutWrite } from '../helpers';
import createLoadBalancer from './loadBalancer.';
import createWorker from './worker';
import { gracefulKill } from './graceful-kill';

dotenv.config();
const { PORT } = env;
const port = +PORT! || 5000;
const numCPUs = os.cpus().length;

export const clusterApp = () => {
  process.on('SIGINT', () => {
    stdoutWrite('Received SIGINT signal, gracefully stopping the cluster process');
    gracefulKill();
  });
  const clusterArgv = checkArgValue(2, '--cluster');
  if (clusterArgv) {
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
      createWorker(+process.env.PORT_WORKER!);
    }
  } else {
    server();
  }
};

export default clusterApp;
