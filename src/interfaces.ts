import { RequestListener, IncomingMessage, ServerResponse } from 'http';

export type ServerListener = RequestListener<typeof IncomingMessage, typeof ServerResponse>;

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}
