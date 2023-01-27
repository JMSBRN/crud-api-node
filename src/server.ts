import { createServer } from 'http';
import { env, stdout } from 'process';
import dotenv from 'dotenv';
import * as user from './user';

const { getUsers } = user;
dotenv.config();
const { PORT } = env;
const server = () => {
  createServer((req, res) => {
    switch (req.method) {
      case 'GET':
        getUsers(req, res);
        break;
      default:
        res.statusCode = 404;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ title: 'NO FOUND', message: 'Rout not found' }));
        res.end();
        break;
    }
  }).listen(PORT, () => {
    stdout.write(`server running on port Localhost :${PORT}`);
  });
};

export default server;
