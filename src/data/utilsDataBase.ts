import { writeFile } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { IUser } from '../features/users/interfaces';

const updateDb = async (data: IUser[]) => {
  writeFile(join(cwd(), 'src/data/', 'database.json'), JSON.stringify(data), (err) => {
    if (err) throw err;
  });
};

export default updateDb;
