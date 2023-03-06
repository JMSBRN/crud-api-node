import { createServer } from 'http';
import supertest from 'supertest';
import { testUser } from '../mocks/testUser';
import routes from '../../src/features/users/routes/routes';
import updateDb from '../../src/data/utilsDataBase';

describe('testing GET requests are woking correctly', () => {
  const server = createServer((req, res) => {
    updateDb([]);
    routes(req, res);
  });
  const r = supertest(server);
  it('should GET get users with empty array', async () => {
    await r
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res).toHaveProperty('body', []);
      });
  });
  it(' should GET with not correct route', async () => {
    await r.get('/api/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
  it('should GET get user by id  with not valid id', async () => {
    await r.get('/api/users/test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'UUID not valid');
      });
  });
});

describe('testing GET requests are woking correctly with exist user in dataBase ', () => {
  const server = createServer((req, res) => {
    updateDb([testUser]);
    routes(req, res);
  });
  const r = supertest(server);
  afterAll(() => {
    updateDb([]);
  });
  it('should GET get user by id  with not exist user', async () => {
    await r.get('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4133')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'User not Found');
      });
  });
  it('should GET get user by id  with not correct route', async () => {
    await r.get('/api/test/users/eb0cd1b8-1c0d-4bca-a201-310df50a4133')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
  it(' should GET get users with created user', async () => {
    await r
      .post('/api/users')
      .send(JSON.stringify(testUser))
      .set('Accept', 'application/json');
    await r
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).toHaveLength(1);
        expect(res.body[0].id).toHaveLength(36);
        expect(res.body[0]).toHaveProperty('username', 'test');
        expect(res.body[0]).toHaveProperty('age', 18);
        expect(res.body[0]).toHaveProperty('hobbies', [
          'test',
        ]);
      });
  });
});
