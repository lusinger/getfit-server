import {Express} from 'express';

import {AuthResponse} from '../interfaces/auth-response';
import {LoginRequest} from '../interfaces/login-request';

import { userExists } from '../modules/database/user-queries';
import { comparePw } from '../modules/pw-encription';
import { signSessionKey } from '../modules/validation/jwt';

export const login = (server: Express, url: string) => {
  return server.get(url, async(req, res) => {
    const request = req.query as unknown as LoginRequest
    const dbResponse = await userExists(request);
    if(dbResponse !== null){
      const {password, mail} = dbResponse.rows[0] as any;
      const validPassword = await comparePw(request.password, password);
      switch(validPassword){
        case true:
          const loginToken = await signSessionKey({mail: mail});
          res.cookie('LOGIN_TOKEN', loginToken, {
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