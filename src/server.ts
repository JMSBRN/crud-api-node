import { createServer } from 'http';
import dotenv from 'dotenv';
import { env } from 'process';
import routes from './features/users/routes/routes';
import { stdoutWrite } from './helpers';

dotenv.config();
const { PORT } = env;
const port = +PORT! || 5000;

const server = () => {
  createServer((req, res) => {
    routes(req, res);
  }).listen(port, () => {
    stdoutWrite(`server is running on port ${port}`);
  });
};
export default server;
