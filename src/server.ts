import { createServer } from 'http';
import dotenv from 'dotenv';
import { env } from 'process';
import routes from './features/users/routes/routes';
import { stdoutWrite } from './helpers';
import updateDb from './data/utilsDataBase';

dotenv.config();
const { PORT } = env;
const port: number = +PORT! || 5000;

const server = () => {
  updateDb([]);
  const serverInstance = createServer((req, res) => {
    routes(req, res);
  });
  serverInstance.listen(port, () => {
    stdoutWrite(`server is running on port ${port}`);
  });
};

export default server;
