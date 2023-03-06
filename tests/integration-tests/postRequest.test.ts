import supertest from 'supertest';
import { testUser } from '../mocks/testUser';
import serverForTests from '../mocks/utilsForTests';

const r = supertest(serverForTests);

describe('testing POST request', () => {
  it('POST request with correct body data', async () => {
    await r
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(JSON.stringify(testUser))
      .expect(201)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'User was created');
      });
  });
  it('POST request with not correct user keys', async () => {
    await r
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(JSON.stringify({
        test: 'test',
      }))
      .expect(400)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'does not contain required fields');
      });
  });
  it('POST request with not correct body data', async () => {
    await r
      .post('/api/users')
      .set('Accept', 'application/json')
      .send('test')
      .expect(400)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'Body data is no correct');
      });
  });

  it('POST request with not correct route', async () => {
    await r
      .post('/api/test/users/')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(404)
      .then((req) => {
        expect(req.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
});
