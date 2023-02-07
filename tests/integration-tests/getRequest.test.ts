import supertest from "supertest";
import { promisify } from "util";
import server from "../../src";
import { testUser } from "../mocks/testUser";

describe('GET request',() => {
    const r = supertest(server);
    afterAll(async () => {
        await promisify(server.close.bind(server))();
       });
    it('GET get users with empty array', async ()=> {
        await r
             .get('/api/users')
             .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(400)
             .then((r) => {
              expect(r.body).toHaveProperty('message', 'Users not Found');
             })
             
       });
    it('GET get users with creted user', async ()=> {
        await r
        .post('/api/users')
           .send(JSON.stringify(testUser))
           .set('Accept', 'application/json');
        await r
             .get('/api/users')
             .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(200)
             .then((r) => {
              expect(r.body).toHaveLength(1);
              expect(r.body[0]).toHaveProperty('id');
              expect(r.body[0]).toHaveProperty('username', 'test');
              expect(r.body[0]).toHaveProperty('age', 18);
              expect(r.body[0]).toHaveProperty('hobbies', [
                'test'
              ]);
              expect(r.body[0].id).toHaveLength(36);
             })
             
       });
       it('GET with not correct route', async () => {
          await  r.get('/api/user')
            .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(404)
             .then((r) => {
                expect(r.body).toHaveProperty('message', 'Oops! Route not Found');
             })
       })
      
});