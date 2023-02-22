import { IUser } from 'features/users/interfaces';
import { stdout } from 'process';

export const setCheckIsIUser = (user: IUser): boolean => {
  if ('username' in user && 'age' in user && 'hobbies' in user) {
    return true;
  }
  return false;
};
export const stdoutWrite = (msg: string) => {
  stdout.write(`${msg}\n`);
};
