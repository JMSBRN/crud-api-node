import { createServer } from 'http';
import updateDb from '../../src/data/utilsDataBase';
import routes from '../../src/features/users/routes/routes';

const serverForTests = createServer((req, res) => {
  updateDb([]);
  routes(req, res);
});
export default serverForTests;
