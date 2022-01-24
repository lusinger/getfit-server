import jwt, { TokenExpiredError } from 'jsonwebtoken';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

const getPrivateKey = async(): Promise<Buffer> => {
  const privateKey = await fs.readFile('./keys/private-key.key');
  return privateKey;
};

const getExpTime = (): number => {
  return process.env.JWT_EXP ? parseInt(process.env.JWT_EXP) : 120;
};

const createSessionToken = async(payload: any): Promise<string> => {
  return jwt.sign(payload, await getPrivateKey(), {algorithm: 'RS256', expiresIn: getExpTime()});
};

const validateSessionToken = async(token: string): Promise<jwt.JwtPayload | null> => {
  try {
    const response = jwt.verify(token, await getPrivateKey());
    console.log(response);
    return response;
  } catch (err) {
    if(err instanceof TokenExpiredError){
      return null;
    }else{
      throw err;
    }
  }
};

export {createSessionToken, validateSessionToken,};