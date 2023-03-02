import { IUser } from 'features/users/interfaces';
import fs from 'fs';
import { join } from 'path';
import { cwd } from 'process';
import { stdoutWrite } from '../helpers';

// Create an empty database array
const db: IUser[] = [];

// Load data from file into memory
try {
  const data = fs.readFileSync(join(cwd(), 'src/data/', 'database.json'), 'utf-8');
  if (data) {
    db.push(...JSON.parse(data.toString()));
  }
} catch (error) {
  stdoutWrite(`Error loading database: ${error}`);
}

// Watch for changes in the database file
fs.watch(join(cwd(), 'src/data/', 'database.json'), (eventType) => {
  if (eventType === 'change') {
    try {
      const data = fs.readFileSync(join(cwd(), 'src/data/', 'database.json'), 'utf-8');
      if (data) {
        db.splice(0, db.length, ...JSON.parse(data.toString()));
        stdoutWrite('Database updated');
      }
    } catch (error) {
      stdoutWrite(`Error updating database: ${error}`);
    }
  }
});

// Export the database array
export default db;
