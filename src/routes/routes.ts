import { errorMessages } from "../constants";
import { ServerListener } from "../interfaces";
import { getUsers, createUser, updateUser, deleteUser } from "../users";
import { setResponseWithErrorMessage } from "../utils";

const routes: ServerListener = (req, res) => {
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
          setResponseWithErrorMessage(404, res, errorMessages.badRout);
          break;
      }
};

export default routes;