import {
  setResponseWithErrorMessage,
  getUsersFromResponse,
  getUserByIdFromResponse,
  createUserWithResponse,
  deleteUserWIthResponse,
  bodyParser,
  updateUserWithresponse,
} from './users.service';
import { IUser, RequestResponse, ServerListener } from './interfaces';
import { errorMessages, StatusCode } from '../../constants';

const { badRout, badBodyData } = errorMessages;
const users: IUser[] = [
  {
    username: 'from controllers',
    age: 18,
    hobbies: [
      'test',
    ],
  },
];

export const getUsers: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (req.url === '/api/users') {
    await getUsersFromResponse(res, users);
  } else if (baseUrl === '/api/users/' && id) {
    await getUserByIdFromResponse(req, res, users);
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
  }
};
export const createUser: RequestResponse = async (req, res) => {
  if (req.url === '/api/users') {
    try {
      const user = await bodyParser(req, res);
      createUserWithResponse(res, user, users);
    } catch (error) {
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badBodyData);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
  }
};
export const updateUser: RequestResponse = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && id) {
    await updateUserWithresponse(req, res, users);
  }
  setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
};
export const deleteUser: RequestResponse = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && id) {
    await deleteUserWIthResponse(req, res, users);
  }
  setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badRout);
};
