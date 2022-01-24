import {Express} from 'express';
import dotenv from 'dotenv';
dotenv.config();

import {AuthResponse} from '../../interfaces/auth-response';
import {LoginRequest} from '../../interfaces/login-request';

import { userExists } from '../database/user-queries';
import { validatePassword } from '../validation/validation-module';
import { createSessionToken } from '../validation/validation-module';

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
          res.cookie(process.env.JWT_SESSION_TOKEN as string, loginToken, {
            httpOnly: true,
            secure: true,
          });
          res.send({
            statusCode: 200,
            message: 'USER_VALID',
          });
          break;
        case false:
          res.send({
            statusCode: 404,
            message: 'USERNAME_OR_PASSWORD_INVALID',
          });
          break;
      }
    }else{
      res.send({
        statusCode: 404,
        message: 'USER_DOES_NOT_EXIST',
      })
    }
  });
}

export { login };