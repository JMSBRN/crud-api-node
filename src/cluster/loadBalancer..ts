import http from 'http';
import { Worker } from 'cluster';
import { stdoutWrite } from '../helpers';
import routes from '../features/users/routes/routes';

export default function createLoadBalancer(workers: Worker[], port: number) {
  let index = 0;

  const server = http.createServer((req, res) => {
    routes(req, res);
    workers[index].send({ url: req.url, method: req.method, headers: req.headers });
    index = (index + 1) % workers.length;
  });

  server.listen(port, () => {
    stdoutWrite(`Load balancer listening on port ${port}`);
  });
}
