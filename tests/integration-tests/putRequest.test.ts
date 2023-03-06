import supertest from 'supertest';
import server from '../../src/server';
import { testUser } from '../mocks/testUser';

const r = supertest(server);

describe('testing PUT request', () => {
  afterEach(() => {
    server.close();
  });
  it('PUT request with no correct route ', async () => {
    await r
      .put('/api/test/users/')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(404)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
  it('PUT request with no valid id ', async () => {
    await r
      .put('/api/users/test')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(400)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'UUID not valid');
      });
  });
  it('PUT request with no exist user ', async () => {
    await r
      .put('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(404)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'User not Found');
      });
  });
});
