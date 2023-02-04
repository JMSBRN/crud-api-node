import { IErrorMessages, IUser } from './interfaces';

export const regexp: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
export const errorMessages: IErrorMessages = {
  noUser: { statusCode: 500, title: 'ERROR', message: 'User not Found' },
  noUsers: { statusCode: 500, title: 'ERROR', message: 'Users not found' },
  badBodyData: { statusCode: 500, title: 'ERROR', message: 'Bad body data' },
  badUUID: { statusCode: 500, title: 'ERROR', message: 'UUID not valid' },
  badRout: { statusCode: 500, title: 'ERROR', message: 'Oops! Route not Found' },
  nowReqFields: { statusCode: 500, title: 'ERROR', message: 'does not contain required fields' },
}
export const DEFAULT_HEADER = { 'Content-Type': 'application/json' };
export enum StatusCode {
  'NOT_FOUND' = 404,
  'BAD_REQUEST' = 400,
  'SUCCESS' = 200,
  'CREATED' = 201,
  'NOT_CONTENT' = 204,
}
export const testUser: IUser = {
  id: 'test',
  username: 'test',
  age: 18,
  hobbies: [
    'test',
  ],
};
