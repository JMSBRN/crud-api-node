import { RequestListener, IncomingMessage, ServerResponse } from 'http';

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
export interface IErrorMessage {
  title: string;
  message: string;
}
export type ServerListener = RequestListener<typeof IncomingMessage, typeof ServerResponse>;
export type ResponseWithErrorMessage = (
  statusCode: number,
  res: ServerResponse,
  obj: IErrorMessage
) => void;
