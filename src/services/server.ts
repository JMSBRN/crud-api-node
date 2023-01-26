/* eslint-disable no-console */
import { createServer } from 'http';
import * as dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();

const { PORT } = env;

const server = () => {
  createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.write('Hi', (err) => {
      console.log('err from write', err);
      res.end(() => {
        console.log('end');
      });
    });
  }).listen(PORT, () => {
    console.log('Server running on port: ', PORT);
  });
};

export default server;
