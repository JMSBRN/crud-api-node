import supertest from "supertest";
import { promisify } from "util";
import server from "../../src";
import { testUser } from "../mocks/testUser";

describe('testing GET requests are woking correctly ',() => {
    const r = supertest(server);
    afterEach(() => { 
      server.close(); 
  });
    it('should GET get users with empty array', async ()=> {
        await r
             .get('/api/users')
             .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(400)
             .then((r) => {
              expect(r.body).toHaveProperty('message', 'Users not Found');
             })
             
       });
    it(' should GET get users with creted user', async ()=> {
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
              expect(r.body[0].id).toHaveLength(36);
              expect(r.body[0]).toHaveProperty('username', 'test');
              expect(r.body[0]).toHaveProperty('age', 18);
              expect(r.body[0]).toHaveProperty('hobbies', [
                'test'
              ]);
             })
             
       });
       it(' should GET with not correct route', async () => {
          await  r.get('/api/user')
            .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(404)
             .then((r) => {
                expect(r.body).toHaveProperty('message', 'Oops! Route not Found');
             })
       })
       it('should GET get user by id  with not valid id', async () => {
          await  r.get('/api/users/test')
            .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(400)
             .then((r) => {
                expect(r.body).toHaveProperty('message', 'UUID not valid');
             })
       })
       it('should GET get user by id  with not exist user', async () => {
          await  r.get('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
            .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(404)
             .then((r) => {
                expect(r.body).toHaveProperty('message', 'User not Found');
             })
       })
       it('should GET get user by id  with not correct route', async () => {
          await  r.get('/api/test/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
            .set('Accept', 'application/json')
             .expect('Content-Type', /json/)
             .expect(404)
             .then((r) => {
                expect(r.body).toHaveProperty('message', 'Oops! Route not Found');
             })
       })
});
 
