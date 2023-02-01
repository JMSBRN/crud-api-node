import { setCheckIsIUser } from './helpers';
import {
  setResponseWithErrorMessage,
  getUsersFromResponse,
  getUserByIdFromResponse,
  createUserWithResponse,
  updateUserWIthResponse,
  bodyParser,
} from './utils';
import { IUser, ServerListener } from './interfaces';
import json from './data/users.json';
import {
  ErrorBadData,
  ErrorIdNotValid,
  ErrorNoFields,
  ErrorNotUser,
  ErrorRouteNotFound,
  regexp,
  StatusCode,
} from './constants';

const users: IUser[] = json;

export const getUsers: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (req.url === '/api/users') {
    await getUsersFromResponse(res, users);
  } else if (!regexp.test(id || '')) {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, { title: 'NO FOUND', message: 'ID not Valid' });
  } else if (baseUrl === '/api/users/' && regexp.test(id || '')) {
    await getUserByIdFromResponse(req, res, users);
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, { title: 'NO FOUND', message: 'Route not found' });
  }
};

export const createUser: ServerListener = async (req, res) => {
  if (req.url === '/api/users') {
    try {
      const user = await bodyParser(req, res);
      createUserWithResponse(res, users, user);
    } catch (error) {
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorBadData);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorRouteNotFound);
  }
};

export const updateUser:ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const reqId = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && regexp.test(reqId || '')) {
    const newArr: IUser[] = [];
    res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
    users.forEach((el) => {
      if (el.id === reqId) {
        newArr.push(el);
      }
    });
    if (newArr.length) {
      try {
        const user = await bodyParser(req, res);
        const isUser: boolean = setCheckIsIUser(user);
        if (isUser) {
          // update user with body request
          Object.assign(users[users.findIndex((el) => el.id === reqId)], user);
          res.writeHead(StatusCode.CREATED, { 'Content-Type': 'application/json' });
          res.end();
        } else {
          setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorNoFields);
        }
      } catch (error) {
        setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorBadData);
      }
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNotUser);
    }
    res.end();
  } else {
    if (!regexp.test(reqId || '')) {
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorIdNotValid);
      return;
    }
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorRouteNotFound);
  }
};
export const deleteUser: ServerListener = async (req, res) => {
  const reqId = req.url?.split('/')[3];

  await updateUserWIthResponse(req, res, users);
  if (!regexp.test(reqId || '')) {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorIdNotValid);
    return;
  }
  setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorRouteNotFound);
};
