import { ServerListener } from './interfaces';

export const getUsers: ServerListener = async (req, res) => {
  if (req.url === '/api/users') {
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ name: 'Alex' }));
    res.end();
  } else {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json');
    res.write(JSON.stringify({ title: 'NO FOUND', message: 'Rout not found' }));
    res.end();
  }
};
export const getUserById = async () => {};
export const createUser = async () => {};
export const updateUser = async () => {};
export const deleteUser = async () => {};
