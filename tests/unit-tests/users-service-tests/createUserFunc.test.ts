import updateDb from '../../../src/data/utilsDataBase';
import { IUser } from '../../../src/features/users/interfaces';
import { createUserWithResponse } from '../../../src/features/users/users.service';

describe('createUserWithResponse', () => {
    type ItestUserNotValid = {
      name: string,
      email: string,
    };

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const user = {
      id: 'eb0cd1b8-1c0d-4bca-a201-310df50a4130',
      username: 'test_create_user',
      age: 18,
      hobbies: [
        'test',
      ],
    };
    afterEach(() => {
      updateDb([]);
    });

    const users: IUser[] = [];
    test('with function with empty array', async () => {
      await createUserWithResponse(res, user, users);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User was created' }));
    });
    test('with function with exist user in dataBase', async () => {
      const dataBaseWithUser = [user];
      await createUserWithResponse(res, user, dataBaseWithUser);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'User already exist' }));
    });
    test('with function with not valid users keys', async () => {
      const notValidUser: ItestUserNotValid = {
        name: 'name_test',
        email: 'email_test',
      };
      await createUserWithResponse(res, notValidUser as any, users);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'does not contain required fields' }));
    });
});
