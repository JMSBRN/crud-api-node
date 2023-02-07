import supertest from "supertest";
import server from "../../src/index";
import { promisify } from "util";
import { testUser } from "../mocks/testUser";

const r = supertest(server);

describe('test routes',  () => {
  afterAll(async () => {
   await promisify(server.close.bind(server))();
  });

     it('POST /api/users', async () =>  {
     await r
     .post('/api/users')
        .send(JSON.stringify(testUser))
        .set('Accept', 'application/json')
        .expect(201)
        .then((r) => {
          expect(r.body).toHaveProperty('message', 'User was created')
        });
      });
      it('PUT //api/users/ wuth id', async ()=> {
      await r
      .put('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
      .send({
        username: 'test_POST',
        age: 18,
        hobbies: [
          'test_POST',
        ],
      })
      .expect(404);
    })
    it('DELETE //api/users/ wuth id', async ()=> {
      await r
      .delete('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
      .send({
        username: 'test_DELETE',
        age: 18,
        hobbies: [
          'test_DELETE',
        ],
      })
      .expect(404)
      .then((r) => {
        expect(r.body).toHaveProperty('message', 'User not Found');
      });
    })

  });