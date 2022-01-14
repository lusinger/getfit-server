import {Express} from 'express';

import {AuthResponse} from '../interfaces/auth-response';
import {LoginRequest} from '../interfaces/login-request';

export const login = (server: Express, url: string) => {
  return server.get(url, (req, res) => {
    const request: LoginRequest | any = req.params;
    //TODO: check if user exists if it does statusCode 200 else 404 not found
    //TODO: if the user exists and credentials match send an auth token to the client
    if(false){
      const response: AuthResponse = {statusCode: 200, message: 'LOGIN_SUCCESSFUL'};
      res.send({
        response,
      });
    }else{
      const response: AuthResponse = {statusCode: 404, message: 'USER_OR_PASSWORD_INVALID'};
      res.send({
        response,
      })
    }
  });
}