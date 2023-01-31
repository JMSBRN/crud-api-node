import { writeFile } from 'fs';
import { IncomingMessage, ServerResponse } from 'http';
import { join } from 'path';
import { cwd } from 'process';
import { v4 as uuidv4 } from 'uuid';
import {
  ErrorBadData,
  ErrorNotUser,
  ErrorNoUsers,
  regexp,
  StatusCode,
} from './constants';
import { setCheckIsIUser } from './helpers';
import { IErrorMessage, IUser, ResponseWithErrorMessage } from './interfaces';

export const setResponseWithErrorMessage: ResponseWithErrorMessage = (
  statusCode: number,
  res,
  obj:IErrorMessage,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ titleText: obj.title, messagetext: obj.message }));
};

export const getUsersFromResponse = async (res: ServerResponse, users: IUser[]) => {
  if (users.length > 0) {
    res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNoUsers);
  }
};
export const getUserByIdFromResponse = async (
  req: IncomingMessage,
  res: ServerResponse,
  users: IUser[],
) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (users.length > 0) {
    res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
    users.forEach((el) => {
      if (el.id === id) {
        newArr.push(el);
      }
      if (newArr.length > 0) {
        res.write(JSON.stringify(newArr));
        res.end();
      } else {
        setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNotUser);
      }
    });
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNoUsers);
  }
};
export const createUserWithResponse = async (res: ServerResponse, users: IUser[], user: IUser) => {
  const isUser: boolean = setCheckIsIUser(user);
  const userWithId = { id: uuidv4(), ...user };
  if (isUser) {
    users.push(userWithId);
    res.writeHead(StatusCode.CREATED, { 'Content-Type': 'application/json' });
    res.end();
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorBadData);
  }
};
export const updateUserWIthResponse = async (
  req: IncomingMessage,
  res: ServerResponse,
  users: IUser[],
) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const reqId = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && regexp.test(reqId || '')) {
    const newArr: IUser[] = [];
    users.forEach((el) => {
      if (el.id === reqId) {
        newArr.push(el);
      }
    });
    if (newArr.length) {
      const newUsers = users.splice(users.findIndex((el) => el.id === reqId), 1);
      writeFile(join(cwd(), 'src/data/', 'users.json'), JSON.stringify(newUsers), (err) => { if (err) throw err; });
      res.writeHead(StatusCode.NOT_CONTENT, { 'Content-Type': 'application/json' });
      res.end();
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNotUser);
    }
  }
};
