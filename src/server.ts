import { createServer } from 'http';
import { env, stdout } from 'process';
import dotenv from 'dotenv';
import { setResponseNotFound } from './utils';
import * as user from './users';

const { getUsers, createUser, updateUser, deleteUser } = user;
dotenv.config();
const { PORT } = env;
const port = PORT || 5000;
const server = () => {
  createServer((req, res) => {
    switch (req.method) {
      case 'GET':
        getUsers(req, res);
        break;
      case 'POST':
        createUser(req, res);
        break;
      case 'PUT':
        updateUser();
        break;
      case 'DELETE':
        deleteUser();
        break;
      default:
        setResponseNotFound(res);
        break;
    }
  }).listen(port, () => {
    stdout.write(`server running on port Localhost :${port}`);
  });
};

export default server;
