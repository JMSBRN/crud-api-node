import { setResponseNotFound } from './utils';
import { ServerListener } from './interfaces';
import users from './data/users.json';

export const getUsers: ServerListener = async (req, res) => {
  const id = req.url?.split('/')[3];
  if (req.url === '/api/users') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify(users));
    res.end();
  } else if (id) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    users.forEach((el) => {
      if (el.id === id) {
        res.write(JSON.stringify(el));
      }
    });
    res.end();
  } else {
    setResponseNotFound(res);
  }
};
export const createUser = async () => {};
export const updateUser = async () => {};
export const deleteUser = async () => {};
