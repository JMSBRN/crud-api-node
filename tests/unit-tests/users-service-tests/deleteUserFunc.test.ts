import { deleteUserWIthResponse } from '../../../src/features/users/users.service';

describe('deleteUserWIthResponse', () => {
  const req = {
    url: '/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130',
  };
  const res = {
    writeHead: jest.fn(),
    end: jest.fn(),
  };
  const users = [{
    id: 'eb0cd1b8-1c0d-4bca-a201-310df50a4130',
    username: 'test_delete_user',
    age: 10,
    hobbies: [],
  },
  ];
  test('function with valid conditions', () => {
    deleteUserWIthResponse(req, res, users);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User was deleted' }));
  });
  test('function with not valid UUID', () => {
    const reqWithNotValidId = {
      url: '/api/users/test',
    };
    deleteUserWIthResponse(reqWithNotValidId, res, users);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'UUID not valid' }));
  });
  test('function with no exist user', () => {
    const reqForNoExisUser = {
      url: '/api/users/eb0cd1b8-1c0d-4bca-a201-310df50a4130',
    };
    const noExistUser = [{
      id: 'eb0cd1b8-1c0d-4bca-a201-310df50a4134',
      username: 'test_delete_user',
      age: 10,
      hobbies: [],
    },
    ];
    deleteUserWIthResponse(reqForNoExisUser, res, noExistUser);
    expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'User not Found' }));
  });
});
