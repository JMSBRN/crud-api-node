import { writeFile } from 'fs';
import { ServerResponse } from 'http';
import { join } from 'path';
import { cwd } from 'process';
import { v4 as uuidv4 } from 'uuid';
import {
  DEFAULT_HEADER,
  errorMessages,
  regexp,
  StatusCode,
} from './constants';
import {testUser} from '../tests/mocks/testUser'
import { setCheckIsIUser } from './helpers';
import {
  BodyParserType,
  IError,
  IUser,
  ResponseWithErrorMessage,
  ResponseWithUserAndUsers,
  ResponseWithUsers,
} from './interfaces';

const { badBodyData, noUsers, noUser, badUUID, badRout, nowReqFields } = errorMessages;
export const setResponseWithErrorMessage: ResponseWithErrorMessage = (
  statusCode: number,
  res,
  obj: IError,
) => {
    res.writeHead(statusCode, DEFAULT_HEADER);
    if (obj) {
      res.end(JSON.stringify(obj));
    }
};

export const bodyParser: BodyParserType = async (req, res) => new Promise((resolve, reject) => {
  let body = '';
  req
    .on('data', (data) => {
      body += data;
    })
    .on('end', () => {
      resolve(JSON.parse(body));
    })
    .on('error', (error: string) => {
      reject(error);
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badBodyData);
    });
});

export const getUsersFromResponse = async (res: ServerResponse, users: IUser[]) => {
  if (users.length > 0) {
    res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
    res.write(JSON.stringify(users));
    res.end();
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, noUsers);
  }
};
export const getUserByIdFromResponse: ResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (regexp.test(id || '')) {
    if (users.length > 0) {
      res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
      users.forEach((el) => {
        if (el.id === id) {
          newArr.push(el);
        }
      });
      if (newArr.length > 0) {
        res.write(JSON.stringify(newArr));
        res.end();
      } else {
        setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUser);
      }
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUsers);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badUUID );
  }
};
export const createUserWithResponse: ResponseWithUserAndUsers = async (res, users, user) => {
  const isUser: boolean = setCheckIsIUser(user);
  const userWithId = { id: uuidv4(), ...user };
  if (isUser) {
    users.push(userWithId);
    res.writeHead(StatusCode.CREATED, DEFAULT_HEADER);
    res.end(JSON.stringify({message: 'User was created'}));
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, nowReqFields);
  }
};

export const updateUserWithresponse:ResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (regexp.test(id || '')) {
    res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
    users.forEach((el) => {
      if (el.id === id) {
        newArr.push(el);
      }
    });
    if (newArr.length > 0) {
      let body = '';
      req
        .on('data', (data) => {
          body += data;
        })
        .on('end', () => {
          const user = JSON.parse(body);
          const isUser = setCheckIsIUser(user);
          if (isUser) {
            Object.assign(newArr[0], user);
          }
        })
        .on('error', () => {
          setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badBodyData);
        });
      res.end();
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badUUID);
  }
};
export const deleteUserWIthResponse: ResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  if (regexp.test(id || '')) {
    const newArr: IUser[] = [];
    users.forEach((el) => {
      if (el.id === id) {
        newArr.push(el);
      }
    });
    if (newArr.length > 0) {
      const newUsers = users.splice(users.findIndex((el) => el.id === id), 1);
      writeFile(join(cwd(), 'src/data/', 'users.json'), JSON.stringify(newUsers || [testUser]), (err) => {
        if (err) throw err;
      });
      res.writeHead(StatusCode.NOT_CONTENT, DEFAULT_HEADER);
      res.end(JSON.stringify({message: 'User was deleted'}));
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badUUID);
  }
};
