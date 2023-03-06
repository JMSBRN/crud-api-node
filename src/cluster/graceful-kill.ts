import cluster, { Worker } from 'cluster';
import updateDb from '../data/utilsDataBase';
import { stdoutWrite } from '../helpers';

export function gracefulKill(timeout = 5000): void {
  stdoutWrite('Gracefully stopping the cluster process');
  updateDb([]);
  if (cluster.workers) {
    Object.values(cluster.workers).forEach((worker: Worker | undefined) => {
    // Gracefully disconnect the worker process
      if (worker) {
        worker.disconnect();
        worker.on('disconnect', () => {
          stdoutWrite(`Worker ${worker.id} has disconnected`);
        });
      }
    });

    const timer = setTimeout(() => {
      stdoutWrite(`Worker processes did not disconnect within ${timeout} ms, forcefully stopping the cluster process`);
      process.exit(1);
    }, timeout);

    // Listen for the 'exit' event to know when all worker processes have exited
    cluster.on('exit', () => {
      if (Object.keys(cluster.workers!).length === 0) {
        stdoutWrite('/n All worker processes have exited, stopping the master process');
        clearTimeout(timer);
        process.exit();
      }
    });
  }
}

export default gracefulKill;
