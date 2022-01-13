import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const getPort = (): number => {
  return process.env.PORT ? parseInt(process.env.PORT) : 3002;
};

const server = express();

server.use(express());
server.use(express.json());
server.use(cookieParser());
server.use(cors());

const port = getPort();

server.listen(port, () => {
  console.log(`[SERVER] is listening on port: ${port}`);
});