import { IUser } from 'interfaces';

export const setCheckIsIUser = (user: IUser): boolean => {
  if ('username' in user && 'age' in user && 'hobbies' in user) {
    return true;
  }
  return false;
};
export default setCheckIsIUser;
