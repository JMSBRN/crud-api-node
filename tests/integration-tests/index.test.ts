import request from "supertest";
import app from '../../src/server';
import { testUser } from "../../src/constants";

describe('test routes', () => {
    it('GET /api.users', async ()=> {
        await request(app)
            .get('/api/users')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200);
      });
      it('GET /api/users/with id', async () =>  {
       await request(app)
          .get('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
          .set('Accept', 'application/json')
          .expect(200);
      });
    it('POST /api/users', async () =>  {
     await  request(app)
        .post('/api/users')
        .send(JSON.stringify(testUser))
        .set('Accept', 'application/json')
        .expect(201);
    });
    it('PUT //api/users/ wuth id', async ()=> {
       await request(app)
       .put('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
       .send({
        username: 'test_POST',
        age: 18,
        hobbies: [
          'test_POST',
        ],
       })
       .expect(200);
    })
    it('DELETE //api/users/ wuth id', async ()=> {
       await request(app)
       .delete('/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
       .send({
        username: 'test_DELETE',
        age: 18,
        hobbies: [
          'test_DELETE',
        ],
       })
       .expect(204);
    })
  });
