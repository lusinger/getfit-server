import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv, { load } from 'dotenv';
dotenv.config();

import { login, logout, register, resetPassword } from './modules/routes/auth-routes-module';
import { loadUserData, updateUserData, deleteUser } from './modules/routes/user-routes-module';
import { getItems } from './modules/routes/get-items-route';
import { addEntriesRoute, deleteEntryRoute, getEntriesRoute, getEntryRoute } from './modules/routes/entry-routes';

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
resetPassword(server, '/api/reset');
loadUserData(server, '/api/user');

getItems(server, '/api/items');

getEntryRoute(server, '/api/entry');
getEntriesRoute(server, '/api/entries');
deleteEntryRoute(server, '/api/delete/entry');
addEntriesRoute(server, '/api/create/entries');

server.listen(port, () => {
  console.log(`[SERVER] is listening on port: ${port}`);
});