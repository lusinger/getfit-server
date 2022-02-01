import {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();

import {query} from '../database/database-module';

import { AuthResponse } from '../../interfaces/auth-response';
import {LoginRequest} from '../../interfaces/login-request';

import { userExists } from '../database/user-queries';
import { createSessionToken, encryptPassword, getResetToken, getSessionToken, validatePassword, validateSessionToken } from '../validation/validation-module';
import { registerUser } from "../database/user-queries";
import { RegisterRequest } from "../../interfaces/register-request";

import { existsMail } from '../database/user-queries';
import { sendResetMail } from '../mail-service/mail-service';

const login = (server: Express, url: string) => {
  return server.get(url, async(req, res) => {
    const request = req.query as unknown as LoginRequest
    const dbResponse = await userExists(request);
    if(dbResponse !== null){
      const {password, mail} = dbResponse.rows[0] as any;
      const validPassword = await validatePassword(request.password, password);
      switch(validPassword){
        case true:
          const loginToken = await createSessionToken({mail: mail});
          res.cookie(getSessionToken(), loginToken, {
            httpOnly: true,
            secure: true,
          });
          res.send({
            statusCode: 200,
            message: 'user is valid',
          } as AuthResponse);
          break;
        case false:
          res.send({
            statusCode: 404,
            message: 'username or password invalid',
          } as AuthResponse);
          break;
      }
    }else{
      res.send({
        statusCode: 404,
        message: 'user not found',
      } as AuthResponse)
    }
  });
};

const logout = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    res.clearCookie(getSessionToken());
    res.send({
      statusCode: 200,
      message: 'session token cleared',
      payload: {logout: true},
    } as AuthResponse);
  });
}; 

const register = async(server: Express, url: string): Promise<Express> => {
  return server.post(url, async(req, res) => {
    const request = req.body as RegisterRequest;

    const hashedPw = await encryptPassword(request.password);
    const dbResponse = await registerUser(request, hashedPw);

    switch(dbResponse){
      case 0: 
        res.status(201).json({
          statusCode: 201,
          message: 'user created',
        } as AuthResponse);
        break;
      case 23505: 
        res.status(409).json({
          statusCode: 409,
          message: 'user already exists',
        } as AuthResponse);
        break;
    };
  });
};

const resetPassword = (server: Express, url: string): Express => {
  return server.put(url, async(req, res) => {
    const resetToken = await validateSessionToken(req.cookies.RESETTOKEN);
    if(resetToken === null){
      if('mail' in req.body){
        const {mail} = req.body;
        const doesMailExist = await existsMail(mail as string);
        if(doesMailExist){
          const resetToken = await createSessionToken({mail: mail});
          sendResetMail(mail, resetToken.slice(0, 10));
          res.cookie(getResetToken(), resetToken, {
            httpOnly: true,
            secure: true,
          });
          res.send({
            statusCode: 200,
            message: `you recieved mail if user with mail ${mail} exists`,
            payload: {allowReset: false},
          } as AuthResponse)
        }
      }
      
    }else{
      if('access' in req.body){
        if(req.body.access === req.cookies.RESETTOKEN.slice(0, 10)){
          res.send({
            statusCode: 200,
            message: 'password reset allowed',
            payload: {allowReset: true},
          } as AuthResponse);
        }else{
          res.send({
            statusCode: 200,
            message: 'password reset allowed',
            payload: {allowReset: false},
          } as AuthResponse);
        }
      }else if('newPassword' in req.body){
        const response = await query('SELECT password FROM users WHERE mail = $1', ['lukas.singer@outlook.com']);
        if(response.rowCount > 0){
          const encryptedPassword = response.rows[0] as any;
          if(await validatePassword(req.body.newPassword, encryptedPassword.password)){
            res.send({
              statusCode: 409,
              message: 'new password cant match old password',
            } as AuthResponse);
          }else{
            const newPassword = await encryptPassword(req.body.newPassword);
            const dbResponse = await query('UPDATE users SET password = $1 WHERE mail = $2', [newPassword, resetToken.mail]);
            res.clearCookie(getResetToken());
            res.send({
              statusCode: 200,
              message: 'password reset',
            } as AuthResponse);
          }
        }
      }
    }
  });
}

export { login, logout, register, resetPassword };

