import { writeFile } from 'fs';
import { ServerResponse } from 'http';
import { join } from 'path';
import { cwd } from 'process';
import { v4 as uuidv4 } from 'uuid';
import {
  ErrorBadData,
  ErrorIdNotValid,
  ErrorNoRequiredFields,
  ErrorNotUser,
  ErrorNoUsers,
  regexp,
  StatusCode,
  testUser,
} from './constants';
import { setCheckIsIUser } from './helpers';
import {
  BodyParserType,
  IErrorMessage,
  IUser,
  ResponseWithErrorMessage,
  ResponseWithUserAndUsers,
  ResponseWithUsers,
} from './interfaces';

export const setResponseWithErrorMessage: ResponseWithErrorMessage = (
  statusCode: number,
  res,
  obj: IErrorMessage,
) => {
  res.writeHead(statusCode, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ statusCode: 500, titleText: obj.title, messageText: obj.message }));
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
      setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorBadData);
    });
});

export const getUsersFromResponse = async (res: ServerResponse, users: IUser[]) => {
  if (users.length > 0) {
    res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorNoUsers);
  }
};
export const getUserByIdFromResponse: ResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (regexp.test(id || '')) {
    if (users.length > 0) {
      res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
      users.forEach((el) => {
        if (el.id === id) {
          newArr.push(el);
        }
      });
      if (newArr.length > 0) {
        res.write(JSON.stringify(newArr));
        res.end();
      } else {
        setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNotUser);
      }
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNoUsers);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorIdNotValid);
  }
};
export const createUserWithResponse: ResponseWithUserAndUsers = async (res, users, user) => {
  const isUser: boolean = setCheckIsIUser(user);
  const userWithId = { id: uuidv4(), ...user };
  if (isUser) {
    users.push(userWithId);
    res.writeHead(StatusCode.CREATED, { 'Content-Type': 'application/json' });
    res.end();
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorNoRequiredFields);
  }
};

export const updateUserWithresponse:ResponseWithUsers = async (req, res, users) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  if (regexp.test(id || '')) {
    res.writeHead(StatusCode.SUCCESS, { 'Content-Type': 'application/json' });
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
          setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorBadData);
        });
      res.end();
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNotUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.BAD_REQUEST, res, ErrorIdNotValid);
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
      const newUsers = users.length > 1 && users.splice(users.findIndex((el) => el.id === id), 1);
      writeFile(join(cwd(), 'src/data/', 'users.json'), JSON.stringify(newUsers || [testUser]), (err) => {
        if (err) throw err;
      });
      res.writeHead(StatusCode.NOT_CONTENT, { 'Content-Type': 'application/json' });
      res.end();
    } else {
      setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorNotUser);
    }
  } else {
    setResponseWithErrorMessage(StatusCode.NOT_FOUND, res, ErrorIdNotValid);
  }
};
