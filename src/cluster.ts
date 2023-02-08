import cluster from "cluster";
import { createServer } from "http";
import { cpus } from "os";
import { pid, stdout } from "process";

const numCPUs = cpus().length;
if (cluster.isPrimary) {
    stdout.write(`Primary running ${pid} `);
    cluster.fork();

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
    
      cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        // start killed 
        cluster.fork();
      });
} else {
  createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}

