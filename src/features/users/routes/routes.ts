import { errorMessages, StatusCode } from '../../../constants';
import { ServerListener } from '../interfaces';
import {
  getUsers, createUser, updateUser, deleteUser,
} from '../users.controller';
import { setResponseWithErrorMessage } from '../users.service';

const routes: ServerListener = async (req, res) => {
  switch (req.method) {
    case 'GET':
      getUsers(req, res);
      break;
    case 'POST':
      createUser(req, res);
      break;
    case 'PUT':
      updateUser(req, res);
      break;
    case 'DELETE':
      deleteUser(req, res);
      break;
    default:
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, errorMessages.badRout);
      break;
  }
};

export default routes;
