import { RequestListener, IncomingMessage, ServerResponse } from 'http';

export type ServerListener = RequestListener<
  typeof IncomingMessage,
  typeof ServerResponse
>;
export type ResponseNotFound = (res: ServerResponse) => void;

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
