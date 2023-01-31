import { setCheckIsIUser } from './helpers';
import {
  setResponseWithErrorMessage,
  getUsersFromResponse,
  getUserByIdFromResponse,
  createUserWithResponse,
  updateUserWIthResponse,
} from './utils';
import { IUser, ServerListener } from './interfaces';
import json from './data/users.json';
import { regexp } from './constants';

const users: IUser[] = json;

export const getUsers: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  if (req.url === '/api/users') {
    await getUsersFromResponse(res, users);
  } else if (!regexp.test(id || '')) {
    setResponseWithErrorMessage(400, res, { title: 'NO FOUND', message: 'ID not Valid' });
  } else if (baseUrl === '/api/users/' && regexp.test(id || '')) {
    await getUserByIdFromResponse(req, res, users);
  } else {
    setResponseWithErrorMessage(404, res, { title: 'NO FOUND', message: 'Route not found' });
  }
};

export const createUser: ServerListener = async (req, res) => {
  if (req.url === '/api/users') {
    let body = '';
    req
      .on('data', (data) => {
        body += data.toString();
      })
      .on('end', () => {
        try {
          const user = JSON.parse(body);
          createUserWithResponse(res, users, user);
        } catch (error) {
          setResponseWithErrorMessage(400, res, { title: 'ERROR', message: 'Bad body Data.  Is your data a proper JSON?\n' });
        }
      });
  } else {
    setResponseWithErrorMessage(404, res, { title: 'NO FOUND', message: 'Route not found' });
  }
};

export const updateUser:ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const reqId = req.url?.split('/')[3];
  if (baseUrl === '/api/users/' && regexp.test(reqId || '')) {
    const newArr: IUser[] = [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    users.forEach((el) => {
      if (el.id === reqId) {
        newArr.push(el);
      }
    });
    if (newArr.length) {
      let body = '';
      req
        .on('data', (data) => {
          body += data.toString();
        })
        .on('end', () => {
          try {
            const user = JSON.parse(body);
            const isUser: boolean = setCheckIsIUser(user);
            if (isUser) {
              // update user with body request
              Object.assign(users[users.findIndex((el) => el.id === reqId)], user);
              res.writeHead(201, { 'Content-Type': 'application/json' });
              res.end();
            } else {
              setResponseWithErrorMessage(400, res, { title: 'ERROR', message: 'Body does not contain required fields' });
            }
          } catch (error) {
            setResponseWithErrorMessage(400, res, { title: 'ERROR', message: 'Bad body data' });
          }
        });
    } else {
      setResponseWithErrorMessage(404, res, { title: 'ERROR', message: 'User not Found' });
    }
    res.end();
  } else {
    if (!regexp.test(reqId || '')) {
      setResponseWithErrorMessage(400, res, { title: 'ERROR', message: 'UUID not valid' });
      return;
    }
    setResponseWithErrorMessage(404, res, { title: 'NO FOUND', message: 'Route not found' });
  }
};
export const deleteUser: ServerListener = async (req, res) => {
  const reqId = req.url?.split('/')[3];

  await updateUserWIthResponse(req, res, users);
  if (!regexp.test(reqId || '')) {
    setResponseWithErrorMessage(400, res, { title: 'ERROR', message: 'UUID not valid' });
    return;
  }
  setResponseWithErrorMessage(404, res, { title: 'NO FOUND', message: 'Route not found' });
};
