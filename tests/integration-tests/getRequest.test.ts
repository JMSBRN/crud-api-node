import supertest from 'supertest';
import { testUser } from '../mocks/testUser';
import updateDb from '../../src/data/utilsDataBase';
import serverForTests from '../mocks/utilsForTests';

const server = supertest(serverForTests);
describe('testing GET requests are woking correctly', () => {
  it('should GET get users with empty array', async () => {
    await server
      .get('/api/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res).toHaveProperty('body', []);
      });
  });
  it(' should GET with not correct route', async () => {
    await server
      .get('/api/user')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
  it('should GET get user by id  with not valid id', async () => {
    await server
      .get('/api/users/test')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'UUID not valid');
      });
  });
});

describe('testing GET requests are woking correctly with exist user in dataBase ', () => {
  afterAll(() => {
    updateDb([]);
  });
  it('should GET get user by id  with not exist user', async () => {
    await server
      .get('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4133')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'User not Found');
      });
  });
  it('should GET get user by id  with bad UUID user', async () => {
    await server
      .get('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a433')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'UUID not valid');
      });
  });
  it('should GET get user by id  with not correct route', async () => {
    await server
      .get('/api/test/users/eb0cd1b8-1c0d-4bca-a201-310df50a4133')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404)
      .then((res) => {
        expect(res.body).toHaveProperty('message', 'Oops! Route not Found');
      });
  });
  it('should GET get users with created user', async () => {
    await server
      .post('/api/users')
      .send(JSON.stringify(testUser))
      .set('Accept', 'application/json');
    await server
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
