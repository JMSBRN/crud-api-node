import supertest from 'supertest';
import { testUser } from '../mocks/testUser';
import serverForTests from '../mocks/utilsForTests';

const server = supertest(serverForTests);

describe('testing PUT request', () => {
  it('PUT request with no correct route ', async () => {
    await server
      .put('/api/test/users/')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(404)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
  it('PUT request with no valid id ', async () => {
    await server
      .put('/api/users/test')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(400)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'UUID not valid');
      });
  });
  it('PUT request with no exist user ', async () => {
    await server
      .put('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(404)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'User not Found');
      });
  });
});
