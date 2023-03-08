import { DEFAULT_HEADER } from '../../../src/constants';
import updateDb from '../../../src/data/utilsDataBase';
import { getUserByIdFromResponse } from '../../../src/features/users/users.service';

type MockedResponse = {
  writeHead: jest.Mock<any, any[]>;
  end: jest.Mock<any, any[]>;
};

describe('getUserByIdFromResponse', () => {
  const res: MockedResponse = {
    writeHead: jest.fn(),
    end: jest.fn(),
  };
  afterEach(() => {
    updateDb([]);
  });

  test('response with exist user in data base and with valid UUID', async () => {
    const req = {
      url: '/api/users/77658c22-11ff-4f04-a685-ad69182053f7',
    };
    const statusCode = 200;
    const users = [{
      id: '77658c22-11ff-4f04-a685-ad69182053f7',
      username: 'test_geUserById',
      age: 10,
      hobbies: [],
    }];
    await getUserByIdFromResponse(req, res, users);
    expect(res.writeHead).toHaveBeenCalledWith(statusCode, DEFAULT_HEADER);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify(users));
  });
  test('response with no exist user in data base, with valid UUID', async () => {
    const req = {
      url: '/api/users/77658c22-11ff-4f04-a685-ad69182053f7',
    };
    const statusCode = 404;
    const users = [{
      id: '77658c22-11ff-4f04-a685-ad69182053f8',
      username: 'test',
      age: 10,
      hobbies: [],
    }];
    await getUserByIdFromResponse(req, res, users);
    expect(res.writeHead).toHaveBeenCalledWith(statusCode, DEFAULT_HEADER);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'User not Found' }));
  });
  test('response with no exist user in data base, with no valid UUID', async () => {
    const req = {
      url: '/api/users/77658c22-11ff-4f04-a685-ad69182053',
    };
    const statusCode = 404;
    const users = [{
      id: '77658c22-11ff-4f04-a685-ad69182053f7',
      username: 'test',
      age: 10,
      hobbies: [],
    }];
    await getUserByIdFromResponse(req, res, users);
    expect(res.writeHead).toHaveBeenCalledWith(statusCode, DEFAULT_HEADER);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'UUID not valid' }));
  });
});
