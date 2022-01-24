import { Express, NextFunction, RequestHandler } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

//--functions handling jsonwebtokens
const getPrivateKey = async(): Promise<Buffer> => {
  const privateKey = await fs.readFile('./keys/private-key.key');
  return privateKey;
};

const getExpTime = (): number => {
  return process.env.JWT_EXP ? parseInt(process.env.JWT_EXP) : 120;
};

const getSessionToken = (): string => {
  return process.env.JWT_SESSION_TOKEN ? process.env.JWT_SESSION_TOKEN : 'SESSIONTOKEN';
};

const getResetToken = (): string => {
  return process.env.JWT_RESET_TOKEN ? process.env.JWT_RESET_TOKEN : 'RESETTOKEN'; 
}

const createSessionToken = async(payload: any): Promise<string> => {
  return jwt.sign(payload, await getPrivateKey(), {algorithm: 'RS256', expiresIn: getExpTime()});
};

const validateSessionToken = async(token: string): Promise<jwt.JwtPayload | null> => {
  try {
    const response = jwt.verify(token, await getPrivateKey());
    return response;
  } catch (err) {
    switch(err){
      case err instanceof TokenExpiredError:
        return null;
      case err instanceof JsonWebTokenError:
        return null;
      default:
        return null;
    }
  }
};

//--functions handling password creation and validation
const getSaltRounds = (): number => {
  return process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
};

const encryptPassword = async(rawPassword: string): Promise<string> => {
  try {
    return await bcrypt.hash(rawPassword, getSaltRounds());
  } catch (err) {
    throw err;
  }
};

const validatePassword = async(rawPassword: string, encrypted: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(rawPassword, encrypted);
  } catch (err) {
    throw err;
  }
};

export {createSessionToken, validateSessionToken, encryptPassword, validatePassword, getResetToken, getSessionToken};