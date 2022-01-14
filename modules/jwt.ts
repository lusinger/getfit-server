import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const getPrivateKey = async() => {
  const key = await fs.readFile('./keys/private-key.key');
  return key;
};

export const getExpTime = (): number => {
  return process.env.JWT_EXP ? parseInt(process.env.JWT_EXP) : 120
};

const signSessionKey = async(payload: object): Promise<string> => {
  const key = await getPrivateKey();
  const token = jwt.sign(payload, key, {algorithm: 'RS256', expiresIn: getExpTime()});
  return token;
};

const validateSessionToken = async(token: string) => {
  const key = await getPrivateKey();
  const response = jwt.verify(token, key);
  console.log(response);
};