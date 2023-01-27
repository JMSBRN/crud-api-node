import { v4 as uuidv4 } from 'uuid';
import { setResponseNotFound } from './utils';
import { IUser, ServerListener } from './interfaces';
import users from './data/users.json';

uuidv4();

export const getUsers: ServerListener = async (req, res) => {
  const id = req.url?.split('/')[3];
  if (req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();
  } else if (id) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const newArr: IUser[] = [];
    users.forEach((el) => {
      if (el.id === id) {
        newArr.push(el);
      }
    });
    if (newArr.length) {
      res.write(JSON.stringify(newArr));
    } else {
      res.write(JSON.stringify({ title: 'ERROR', message: 'User not Found' }));
    }
    res.end();
  } else {
    setResponseNotFound(res);
  }
};
export const createUser = async () => {};
export const updateUser = async () => {};
export const deleteUser = async () => {};
