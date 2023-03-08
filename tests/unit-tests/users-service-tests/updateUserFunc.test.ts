import updateDb from '../../../src/data/utilsDataBase';
import { updateUserWithresponse } from '../../../src/features/users/users.service';
import { testUser } from '../../mocks/testUser';

describe('updateUserWithresponse', () => {
  afterEach(() => {
    updateDb([]);
  });
  test('function with invalid UUID', async () => {
    const req = {
      url: '/api/users/1234',
      body: testUser,
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const users = [testUser];
    updateUserWithresponse(req, res, users);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'UUID not valid' }));
  });
  test('function with no exist user', async () => {
    const req = {
      url: '/api/users/ca3ac349-c842-4231-9cdb-2a63bff56668',
      body: testUser,
    };
    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const users = [testUser];
    updateUserWithresponse(req, res, users);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'User not Found' }));
  });
});
