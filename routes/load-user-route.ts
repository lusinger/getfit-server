import {Express} from 'express';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '../interfaces/auth-response';

import {query} from '../modules/database/database-module';

export const loadUser = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      const token = req.cookies.SESSION_TOKEN;
      const decoded = await jwt.decode(token) as any;

      const dbResponse = await query('SELECT username, mail, fullname, age, height, currentweight, targetweight, changeperweek, caloriegoal FROM users WHERE mail = $1', [decoded.mail]);

      if(dbResponse.rowCount > 0){
        const successResponse: AuthResponse = {statusCode: 200, message: 'USER_LOADED', payload: dbResponse.rows[0]};
        res.send(
          successResponse,
        )
      }else{
        const errorResponse: AuthResponse = {statusCode: 404, message: 'FAILED_TO_LOAD_USER'};
        res.send(
          errorResponse,
        )
      }
    } catch (err) {
      throw err;
    }
  });
}