import updateDb from '../../../src/data/utilsDataBase';
import { IUser } from '../../../src/features/users/interfaces';
import { createUserWithResponse } from '../../../src/features/users/users.service';
import { testUser } from '../../mocks/testUser';

describe('createUserWithResponse', () => {
    type ItestUserNotValid = {
      name: string,
      email: string,
    };

    const res = {
      writeHead: jest.fn(),
      end: jest.fn(),
    };
    const user = testUser;
    afterEach(() => {
      updateDb([]);
    });

    test('with function with empty array', async () => {
      const users: IUser[] = [];
      createUserWithResponse(res, user, users);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ message: 'User was created' }));
    });
    test('with function with exist user in dataBase', async () => {
      const users: IUser[] = [testUser];
      createUserWithResponse(res, user, users);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'User already exist' }));
    });
    test('with function with not valid users keys', async () => {
      const users: IUser[] = [testUser];
      const notValidUser: ItestUserNotValid = {
        name: 'name_test',
        email: 'email_test',
      };
      createUserWithResponse(res, notValidUser as any, users);
      expect(res.end).toHaveBeenCalledWith(JSON.stringify({ statusCode: 500, title: 'ERROR', message: 'does not contain required fields' }));
    });
});
