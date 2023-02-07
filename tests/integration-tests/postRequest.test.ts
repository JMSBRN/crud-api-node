import supertest from "supertest"
import { promisify } from "util";
import server from "../../src"
import { testUser } from "../mocks/testUser";

const r = supertest(server);

describe('testing POST request',()=> {
    afterAll( async () => {
    await promisify(server.close.bind(server))();
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
