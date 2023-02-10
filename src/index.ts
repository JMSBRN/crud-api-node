import { createServer } from 'http';
import dotenv from 'dotenv';
import routes from './routes/routes';

dotenv.config();
// const { PORT } = env;
// const port = PORT || 5000;

const server = createServer((req, res) => {
  routes(req, res);
});

export default server;
