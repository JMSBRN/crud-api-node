import { stdoutWrite } from '../helpers';
import { IUser, IMessageToChild } from '../features/users/interfaces';

let users: IUser[] = [];

process.on('message', (msg: IMessageToChild) => {
  if (msg != null && typeof msg === 'object') {
    stdoutWrite(`Received object from parent: ${JSON.stringify(msg)}`);
    switch (msg.type) {
      case 'GET':
        if (process.send) {
          process.send({ ...msg, data: users });
        }
        return;
      case 'POST':
        users = [{
          id: '1',
          username: 'name',
          age: 2,
          hobbies: [
            'hobbies',
          ],
        }];
        if (process.send) {
          process.send({ ...msg, data: users });
        }
        break;
      default:
        break;
    }
  }
});
