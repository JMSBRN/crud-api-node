import { clusterApp } from '../../src/cluster/cluster';

describe('clusterApp', () => {
  test('should be a function', () => {
    expect(typeof clusterApp).toBe('function');
  });

  test('should return undefined', () => {
    expect(clusterApp()).toBeUndefined();
  });
});
