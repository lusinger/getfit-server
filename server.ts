import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import {login} from './routes/login-route';
import { register } from './routes/register-route';
import { loadUser } from './routes/load-user-route';
import { resetPwRequest } from './routes/reset-password-request';
import {resetPw} from './routes/reset-password';
import { getItems } from './routes/get-items-route';
import { logout } from './routes/logout-route';
import { addEntriesRoute, deleteEntryRoute, getEntriesRoute, getEntryRoute } from './routes/entry-routes';

const getPort = (): number => {
  return process.env.PORT ? parseInt(process.env.PORT) : 3002;
};

const server = express();

server.use(express());
server.use(express.json());
server.use(cookieParser());
server.use(cors({
  credentials: true,
  origin: 'http://localhost:4200',
}));

const port = getPort();

register(server, '/api/register');
login(server, '/api/login');
logout(server, '/api/logout');
loadUser(server, '/api/loaduser');
resetPwRequest(server, '/api/requestpwreset');
resetPw(server, '/api/resetpassword');

getItems(server, '/api/items');

getEntryRoute(server, '/api/entry');
getEntriesRoute(server, '/api/entries');
deleteEntryRoute(server, '/api/delete/entry');
addEntriesRoute(server, '/api/create/entries');

server.listen(port, () => {
  console.log(`[SERVER] is listening on port: ${port}`);
});