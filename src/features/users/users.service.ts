import { ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';
import base from '../../data/database';
import {
  DEFAULT_HEADER,
  errorMessages,
  regexp,
  StatusCode,
} from '../../constants';
import { setCheckIsIUser } from '../../helpers';
import {
  BodyParserType,
  IError,
  IUser,
  RequestResponse,
  ResponseWithErrorMessage,
  ResponseWithUser,
} from './interfaces';

const database: IUser[] = base;

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

export const getUsersFromResponse = async (res: ServerResponse) => {
  if (database.length > 0) {
    res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
    res.write(JSON.stringify(database));
    res.end();
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, noUsers);
  }
};
export const getUserByIdFromResponse: RequestResponse = async (req, res) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (regexp.test(id || '')) {
    if (database.length > 0) {
      res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
      database.forEach((el) => {
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
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, badUUID);
  }
};
export const createUserWithResponse: ResponseWithUser = async (res, user) => {
  const newArr: IUser[] = [];
  database.forEach((el) => {
    if (el.username === user.username) {
      newArr.push(el);
    }
  });
  if (!newArr.length) {
    const isUser: boolean = setCheckIsIUser(user);
    const userWithId = { id: uuidv4(), ...user };
    if (isUser) {
      database.push(userWithId);
      res.writeHead(StatusCode.CREATED, DEFAULT_HEADER);
      res.end(JSON.stringify({ message: 'User was created' }));
    } else {
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, nowReqFields);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, userExist);
  }
};

export const updateUserWithresponse: RequestResponse = async (req, res) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (regexp.test(id || '')) {
    res.writeHead(StatusCode.SUCCESS, DEFAULT_HEADER);
    database.forEach((el) => {
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
export const deleteUserWIthResponse: RequestResponse = async (req, res) => {
  const id = req.url?.split('/')[3];
  if (regexp.test(id || '')) {
    const newArr: IUser[] = [];
    database.forEach((el) => {
      if (el.id === id) {
        newArr.push(el);
      }
    });
    if (newArr.length > 0) {
      database.splice(
        database.findIndex((el) => el.id === id),
        1,
      );
      res.writeHead(StatusCode.NOT_CONTENT, DEFAULT_HEADER);
      res.end(JSON.stringify({ message: 'User was deleted' }));
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, noUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, badUUID);
  }
};
