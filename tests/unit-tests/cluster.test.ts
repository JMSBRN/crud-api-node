import { clusterApp } from '../../src/cluster/cluster';
import { checkArgValue } from '../../src/helpers';
import server from '../../src/server';

jest.mock('../../src/helpers', () => ({
  checkArgValue: jest.fn(() => null),
}));

jest.mock('../../src/server', () => jest.fn());

describe('clusterApp', () => {
  it('starts the server when the --cluster argument is not provided', () => {
    clusterApp();
    expect(checkArgValue).toHaveBeenCalledTimes(1);
    expect(checkArgValue).toHaveBeenCalledWith(2, '--cluster');
    expect(server).toHaveBeenCalledTimes(1);
  });
});
