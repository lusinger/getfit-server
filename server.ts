import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import {login} from './routes/login-route';
import { register } from './routes/register-route';
import { loadUser } from './routes/load-user-route';

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
loadUser(server, '/api/loaduser');

server.listen(port, () => {
  console.log(`[SERVER] is listening on port: ${port}`);
});