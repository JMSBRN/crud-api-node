import { createServer } from 'http';
import dotenv from 'dotenv';
import { env } from 'process';
import server from '../../src/server';

dotenv.config();
const { PORT } = env;
const port: number = +PORT! || 5000;

describe('server', () => {
  let listenMock: jest.Mock;
  beforeEach(() => {
    listenMock = jest.fn();
    (createServer as jest.Mock) = jest.fn(() => ({ listen: listenMock }));
  });

  it('should start server and listen on given port', async () => {
    server();
    expect(createServer).toHaveBeenCalledTimes(1);
    expect(listenMock).toHaveBeenCalledTimes(1);
    expect(listenMock).toHaveBeenCalledWith(port, expect.any(Function));
  });
});
