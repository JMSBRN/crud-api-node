import { writeFileSync } from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { IUser } from '../features/users/interfaces';

const updateDb = async (data: IUser[]) => {
  let curData: IUser[] = data;
  curData = data;
  writeFileSync(join(cwd(), 'src/data/', 'database.json'), JSON.stringify(curData), { flag: 'w' });
};

export default updateDb;
