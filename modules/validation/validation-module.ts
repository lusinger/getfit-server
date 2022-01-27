import { Express, NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import fs from 'fs/promises';
import dotenv from 'dotenv';
import { AuthResponse } from '../../interfaces/auth-response';
dotenv.config();

//--Middleware function that handles token validation
const authValidation = async (req: Request, res: Response, next: NextFunction) => {
  if('RESETTOKEN' in req.cookies){
    const isTokenValid = await validateSessionToken(req.cookies.RESETTOKEN);
    if(isTokenValid !== null){
      req.body.tokenValue = isTokenValid.mail;
      next();
    }else{
      return res.send({
        statusCode: 401,
        message: 'not authorized',
      } as AuthResponse);
    }
  }else if('SESSIONTOKEN' in req.cookies){
    const isTokenValid = await validateSessionToken(req.cookies.SESSIONTOKEN);
    if(isTokenValid !== null){
      req.body.tokenValue = isTokenValid.mail;
      next();
    }else{
      return res.send({
        statusCode: 401,
        message: 'not authorized',
      } as AuthResponse);
    }
  }else{
    return res.send({
      statusCode: 401,
      message: 'not authorized',
    } as AuthResponse);
  }
}

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

export {authValidation, createSessionToken, validateSessionToken, encryptPassword, validatePassword, getResetToken, getSessionToken};