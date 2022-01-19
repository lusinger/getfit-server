import jwt, { TokenExpiredError } from 'jsonwebtoken';
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

export const signSessionKey = async(payload: object): Promise<string> => {
  const key = await getPrivateKey();
  const token = jwt.sign(payload, key, {algorithm: 'RS256', expiresIn: getExpTime()});
  return token;
};

export const validateSessionToken = async(token: string): Promise<jwt.JwtPayload | null> => {
  try {
    const key = await getPrivateKey();
    const response = jwt.verify(token, key);
    console.log(response);
    return response;
  } catch (err) {
    if(err instanceof TokenExpiredError){
      return null
    }else{
      throw err;
    }
  }
};