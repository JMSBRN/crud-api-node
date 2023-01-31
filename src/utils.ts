import { IncomingMessage, ServerResponse } from 'http';
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
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(users));
  res.end();
};
export const getUserByIdFromResponse = async (
  req: IncomingMessage,
  res: ServerResponse,
  users: IUser[],
) => {
  const id = req.url?.split('/')[3];
  const newArr: IUser[] = [];
  res.writeHead(200, { 'Content-Type': 'application/json' });
  users.forEach((el) => {
    if (el.id === id) {
      newArr.push(el);
    }
    if (newArr.length > 0) {
      res.write(JSON.stringify(newArr));
      res.end();
    } else {
      setResponseWithErrorMessage(404, res, { title: 'Error', message: 'User not Found' });
    }
  });
};
