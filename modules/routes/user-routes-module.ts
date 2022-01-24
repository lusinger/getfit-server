import {Express} from 'express';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '../../interfaces/auth-response';
import { validateSessionToken } from '../validation/validation-module';

import {query} from '../database/database-module';

const loadUserData = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      const token = req.cookies.SESSIONTOKEN;
      const isTokenValid = await validateSessionToken(token);

      if(isTokenValid){
        const {mail} = await jwt.decode(token) as any;
        const dbResponse = await query('SELECT id, username, mail, fullname, age, height, currentweight, targetweight, changeperweek, gender, activityrating, caloriegoal, createdon  FROM users WHERE mail = $1', [mail]);
        if(dbResponse.rowCount > 0){
          res.send({
            statusCode: 200,
            message: 'user loaded',
            payload: dbResponse.rows[0],
          } as AuthResponse);
        }else{
          const errorResponse: AuthResponse = {statusCode: 404, message: 'FAILED_TO_LOAD_USER'};
          res.send({
            statusCode: 404, 
            message: 'no user found'
          } as AuthResponse);
        }
      }else{
        res.send({
          statusCode: 404,
          message: 'token not valid'
        } as AuthResponse);
      }
    } catch (err) {
      throw err;
    }
  });
}

const updateUserData = (server: Express, url: string): Express => {
  return server.put(url, async(req, res) => {
    try {
      
    } catch (err) {
      throw err;
    }
  });
};

const deleteUser = (server: Express, url: string): Express => {
  return server.delete(url, async(req, res) => {
    try {
      
    } catch (err) {
      throw err;
    }
  }); 
};

export  { loadUserData, updateUserData, deleteUser }