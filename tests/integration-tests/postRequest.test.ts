import supertest from "supertest"
import server from "../../src"
import { testUser } from "../mocks/testUser";

const r = supertest(server);

describe('testing POST request',()=> {
  afterEach(() => { 
    server.close(); 
});
    it('POST request with correct body data', async ()=> {
      await  r
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(JSON.stringify(testUser))
        .expect(201)
        .then((r) => {
          expect(r.body).toHaveProperty('message', 'User was created');
        })
    });
    it('POST request with not correct user keys', async ()=> {
      await  r
        .post('/api/users')
        .set('Accept', 'application/json')
        .send(JSON.stringify({
          test: 'test'
        }))
        .expect(400)
        .then((r) => {
          expect(r.body).toHaveProperty('message', 'does not contain required fields');
        })
    });
    it('POST request with not correct body data', async ()=> {
      await  r
        .post('/api/users')
        .set('Accept', 'application/json')
        .send('test')
        .expect(400)
        .then((r) => {
          expect(r.body).toHaveProperty('message', 'Body data is no correct');
        })
    });

  it('POST request with not correct route', async ()=> {
    await  r
      .post('/api/test/users/')
      .set('Accept', 'application/json')
      .send(testUser)
      .expect(404)
      .then((r) => {
        expect(r.body).toHaveProperty('message', 'Oops! Route not Found');
      })
  })
});

