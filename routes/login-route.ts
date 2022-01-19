import {Express} from 'express';

import {AuthResponse} from '../interfaces/auth-response';
import {LoginRequest} from '../interfaces/login-request';

import { existsUser } from '../modules/database/user-queries';
import { comparePw } from '../modules/pw-encription';
import { signSessionKey } from '../modules/validation/jwt';

export const login = (server: Express, url: string) => {
  return server.get(url, async(req, res) => {
    const request = req.query as unknown as LoginRequest
    const exists = await existsUser(request) as unknown as {username: string, mail: string, password: string};
    let pwValid: boolean = false;
    if(exists){
      pwValid = await comparePw(request.password, exists.password);
    }
    switch(exists && pwValid){
      case true:
        const token = await signSessionKey({mail: exists.mail});
        const successResponse: AuthResponse = {statusCode: 200, message: 'LOGIN_SUCCESSFUL', payload: token};
        console.log(token);
        res.cookie('SESSION_TOKEN', token, {
          httpOnly: true,
          secure: false
        });
        res.send(
          successResponse
        );
        break;
      case false:
        const errorResponse: AuthResponse = {statusCode: 404, message: 'USER_OR_PASSWORD_INVALID'};
        res.send(
          errorResponse,
        );
        break;
    }
  });
}