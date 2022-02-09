import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

import { authRouter } from './modules/routes/auth-routes-module';
import {userRouter} from './modules/routes/user-routes-module';
import {entryRouter} from './modules/routes/entry-routes-module';
import { itemRouter } from './modules/routes/item-routes-module';
import { initializeDB } from './modules/database/database-module';

const getPort = (): number => {
  return process.env.PORT ? parseInt(process.env.PORT) : 3002;
};

const server = express();
const port = getPort();

server.use(express());
server.use(express.json());
server.use(cookieParser());
server.use(cors({
  credentials: true,
  origin: 'http://localhost:4200',
}));
server.use('/auth', authRouter);
server.use('/api/user', userRouter);
server.use('/api/entry', entryRouter);
server.use('/api/item', itemRouter);

server.listen(port, async() => {
  await initializeDB();
  console.log(`[SERVER] is listening on port: ${port}`);
});