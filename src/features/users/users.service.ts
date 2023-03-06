import { ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import updateDb from '../../data/utilsDataBase';

import {
  DEFAULT_HEADER,
  errorMessages,
  regexp,
  StatusCode,
  USER_CREATED_MSG,
} from '../../constants';
import { setCheckIsIUser } from '../../helpers';
import {
  BodyParserType,
  IError,
  IUser,
  RequestResponseWithUsers,
  ResponseWithErrorMessage,
  ResponseWithUserAndUsers,
} from './interfaces';

const {
  badBodyData, noUsers, noUser, badUUID, nowReqFields, userExist,
} = errorMessages;

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
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badBodyData);
      }
    })
    .on('error', (error: string) => {
      reject(error);
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badBodyData);
    });
});

export const getUsersFromResponse = async (res: ServerResponse, users: IUser[]) => {
  updateDb(users);
  res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
  res.write(JSON.stringify(users));
  res.end();
};
export const getUserByIdFromResponse: RequestResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  if (regexp.test(id || '')) {
    res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
    const newArr = users.filter((el) => el.id === id);
    if (newArr.length > 0) {
      updateDb(users);
      res.write(JSON.stringify(newArr));
      res.end();
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badUUID);
  }
};
export const createUserWithResponse: ResponseWithUserAndUsers = async (res, user, users) => {
  const newArr = users.filter((el) => el.username === user.username);
  if (!newArr.length) {
    const isUser: boolean = setCheckIsIUser(user);
    const userWithId = { id: uuidv4(), ...user };
    if (isUser) {
      const arrWithNewUser = [...users, userWithId];
      updateDb(arrWithNewUser);
      res.writeHead(StatusCode.CREATED, DEFAULT_HEADER);
      res.end(JSON.stringify(USER_CREATED_MSG));
    } else {
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, nowReqFields);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, userExist);
  }
};

export const updateUserWithresponse: RequestResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  if (regexp.test(id || '')) {
    res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
    const newArr = users.filter((el) => el.id === id);
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
            updateDb(users);
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
export const deleteUserWIthResponse: RequestResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  if (regexp.test(id || '')) {
    const newArr = users.filter((el) => el.id === id);
    if (newArr.length > 0) {
      const index = users.findIndex((el) => el.id === id);
      users.splice(index, 1);
      updateDb(users);
      res.writeHead(StatusCode.NOT_CONTENT, DEFAULT_HEADER);
      res.end(JSON.stringify(USER_CREATED_MSG));
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badUUID);
  }
};
