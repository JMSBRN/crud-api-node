import { RequestListener, IncomingMessage, ServerResponse } from 'http';

export interface IUser {
  id?: string;
  username: string;
  age: number;
  hobbies: string[];
}
export interface IError {
  readonly statusCode: number;
  readonly title: string;
  readonly message: string;
}
export interface IErrorMessages {
  noUser: IError;
  noUsers: IError;
  badBodyData: IError;
  badUUID: IError;
  badRout: IError;
  nowReqFields: IError;
  userExist: IError;
}

export type ServerListener = RequestListener<typeof IncomingMessage, typeof ServerResponse>;
export type ResponseWithErrorMessage = (
  statusCode: number,
  res: ServerResponse,
  obj: IError
) => void;
export type BodyParserType = (req: IncomingMessage, res: ServerResponse) => Promise<IUser>;
export type RequestResponse = (
  req: IncomingMessage,
  res: ServerResponse,
) => Promise<void>;
export type RequestResponseWithUser = (
  req: IncomingMessage,
  res: ServerResponse,
  user: IUser
) => Promise<void>;
export type ResponseWithUser = (
  res: ServerResponse,
  user: IUser
) => Promise<void>;