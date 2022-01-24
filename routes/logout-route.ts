import {Express} from 'express';
import { AuthResponse } from '../interfaces/auth-response';

export const logout = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    const token = req.cookies.LOGIN_TOKEN;
    const response: AuthResponse = {statusCode: 200, message: 'SESSION_TOKEN_CLEARED', payload: {logout: true}};

    res.clearCookie('LOGIN_TOKEN');
    res.send(
      response,
    )
  });
}