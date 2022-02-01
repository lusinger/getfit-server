import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { login, logout, register, resetPassword } from './modules/routes/auth-routes-module';
import { loadUserData, updateUserData, deleteUser } from './modules/routes/user-routes-module';
import { getItems, getEntry, getEntries, deleteEntry, addEntries, addImage, updateEntry } from './modules/routes/data-routes-module';

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
deleteUser(server, '/api/delete/user');
updateEntry(server, '/api/update/entry');

getItems(server, '/api/items');

getEntry(server, '/api/entry');
getEntries(server, '/api/entries');
deleteEntry(server, '/api/delete/entry');
addEntries(server, '/api/create/entries');

addImage(server, '/api/add/image');

server.listen(port, () => {
  console.log(`[SERVER] is listening on port: ${port}`);
});