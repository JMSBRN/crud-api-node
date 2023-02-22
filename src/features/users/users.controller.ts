import {
  setResponseWithErrorMessage,
  getUsersFromResponse,
  getUserByIdFromResponse,
  createUserWithResponse,
  deleteUserWIthResponse,
  bodyParser,
  updateUserWithresponse,
} from './users.service';
import { ServerListener } from './interfaces';
import { errorMessages, StatusCode } from '../../constants';

const { badRout, badBodyData } = errorMessages;

export const getUsers: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (req.url === '/api/users') {
    await getUsersFromResponse(res);
  } else if (baseUrl === '/api/users/' && id) {
    await getUserByIdFromResponse(req, res);
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
  }
};
export const createUser: ServerListener = async (req, res) => {
  if (req.url === '/api/users') {
    try {
      const user = await bodyParser(req, res);
      createUserWithResponse(res, user);
    } catch (error) {
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badBodyData);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
  }
};
export const updateUser: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && id) {
    await updateUserWithresponse(req, res);
  }
  setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
};
export const deleteUser: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && id) {
    await deleteUserWIthResponse(req, res);
  }
  setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
};
