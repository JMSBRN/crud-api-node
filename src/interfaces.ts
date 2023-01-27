import { RequestListener, IncomingMessage, ServerResponse } from 'http';

export type ServerListener = RequestListener<typeof IncomingMessage, typeof ServerResponse>;
