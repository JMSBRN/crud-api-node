import { IError, IUser } from './interfaces';

export const regexp: RegExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
export const ErrorNotUser: IError = { title: 'ERROR', message: 'User not Found' };
export const ErrorNoUsers: IError = { title: 'ERROR', message: 'Users not found' };
export const ErrorNoFields: IError = {
  title: 'ERROR',
  message: 'Body does not contain required fields',
};
export const ErrorBadData: IError = { title: 'ERROR', message: 'Bad body data' };
export const ErrorIdNotValid: IError = { title: 'ERROR', message: 'UUID not valid' };
export const ErrorRouteNotFound: IError = { title: 'ERROR', message: 'Oops! Route not Found' };
export const ErrorNoRequiredFields: IError = { title: 'ERROR', message: 'does not contain required fields' };

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
