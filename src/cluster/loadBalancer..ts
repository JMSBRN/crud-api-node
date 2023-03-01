import http from 'http';
import { Worker } from 'cluster';
import { fork } from 'child_process';
import { join } from 'path';
import { cwd } from 'process';
import { stdoutWrite } from '../helpers';
import routes from '../features/users/routes/routes';

const child = fork(join(cwd(), 'src/features/users/', 'users.service.ts'));

child.on('message', (msg) => {
  stdoutWrite(`Received  from child: ${JSON.stringify(msg)}`);
});
export default function createLoadBalancer(workers: Worker[], port: number) {
  let index = 0;

  const server = http.createServer((req, res) => {
    routes(req, res);
    workers[index].send({ url: req.url, method: req.method, headers: req.headers });
    child.send({ type: req.method });
    index = (index + 1) % workers.length;
    res.end();
  });

  server.listen(port, () => {
    stdoutWrite(`Load balancer listening on port ${port}`);
  });
}
