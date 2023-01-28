import { v4 as uuidv4 } from 'uuid';
import { setResponseNotFound } from './utils';
import { IUser, ServerListener } from './interfaces';
import json from './data/users.json';

const users: IUser[] = json;
export const getUsers: ServerListener = async (req, res) => {
  const baseUrl = req.url?.substring(0, req.url.lastIndexOf('/') + 1);
  const id = req.url?.split('/')[3];
  const regexp: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
  if (req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();
  } else if (baseUrl === '/api/users/' && regexp.test(id || '')) {
    const newArr: IUser[] = [];
    res.writeHead(200, { 'Content-Type': 'application/json' });
    users.forEach((el) => {
      if (el.id === id) {
        newArr.push(el);
      }
    });
    if (newArr.length) {
      res.write(JSON.stringify(newArr));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ title: 'ERROR', message: 'User not Found' }));
      res.end();
    }
    res.end();
  } else {
    if (!regexp.test(id || '')) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.write(JSON.stringify({ title: 'ERROR', message: 'UUID not valid' }));
      res.end();
      return;
    }
    setResponseNotFound(res);
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
          user.id = uuidv4();
          users.push(user);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end();
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.write('Bad Post Data.  Is your data a proper JSON?\n');
          res.end();
        }
      });
  } else {
    setResponseNotFound(res);
  }
};

export const updateUser = async () => {};
export const deleteUser = async () => {};
