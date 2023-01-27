import { ResponseNotFound } from './interfaces';

export const setResponseNotFound: ResponseNotFound = (res) => {
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify({ title: 'NO FOUND', message: 'Route not found' }));
  res.end();
};

export default setResponseNotFound;
