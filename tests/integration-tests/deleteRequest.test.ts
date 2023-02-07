import supertest from "supertest";
import { promisify } from "util";
import server from "../../src";

describe('',() => {
    const r = supertest(server);
    afterEach(() => { 
        server.close(); 
    });
    it('DELETE request with no exist user', async ()=> {
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
      });
    it('DELETE request with no valid', async ()=> {
        await r
        .delete('/api/users/test')
        .send({
          username: 'test_DELETE',
          age: 18,
          hobbies: [
            'test_DELETE',
          ],
        })
        .expect(404)
        .then((r) => {
          expect(r.body).toHaveProperty('message', 'UUID not valid');
        });
      });
    it('DELETE request with no correct route', async ()=> {
        await r
        .delete('/api/test/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130')
        .send({
          username: 'test_DELETE',
          age: 18,
          hobbies: [
            'test_DELETE'
          ],
        })
        .expect(404)
        .then((r) => {
          expect(r.body).toHaveProperty('message', 'Oops! Route not Found');
        });
      });
});