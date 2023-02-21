import http from 'http';
import { Worker } from 'cluster';
import { stdoutWrite } from './utils';

export default function createLoadBalancer(workers: Worker[], port: number) {
  let index = 0;

  const server = http.createServer((req, res) => {
    // Forward request to next worker
    workers[index].send({ url: req.url, method: req.method, headers: req.headers });
    index = (index + 1) % workers.length;
    res.end();
  });

  server.listen(port, () => {
    stdoutWrite(`Load balancer listening on port ${port}`);
  });
}
