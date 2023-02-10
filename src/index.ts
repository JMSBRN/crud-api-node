import { createServer } from 'http';
import { env, stdout } from 'process';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config();
const { PORT } = env;
const port = PORT || 5000;

const server = createServer((req, res) => {
  routes(req, res);
}).listen(port, () => {
  stdout.write(`server running on port Localhost :${port}`);
});

export default server;
