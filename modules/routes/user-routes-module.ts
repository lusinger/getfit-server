import {Express} from 'express';
import jwt from 'jsonwebtoken';
import { AuthResponse } from '../../interfaces/auth-response';
import { getSessionToken, validateSessionToken, authValidation } from '../validation/validation-module';

import {query} from '../database/database-module';
import { User } from '../../interfaces/user';

const loadUserData = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      const token = req.cookies.SESSIONTOKEN;
      const isTokenValid = await validateSessionToken(token);

      if(isTokenValid){
        const {mail} = await jwt.decode(token) as any;
        const dbResponse = await query('SELECT id, username, mail, fullname, age, height, currentweight, targetweight, changeperweek, gender, activityrating, caloriegoal, createdon  FROM users WHERE mail = $1', [mail]);
        if(dbResponse.rowCount > 0){
          const {id, username, mail, fullname, age, height, currentweight, targetweight, changeperweek, gender, activityrating, caloriegoal, createdon} = dbResponse.rows[0] as unknown as any;
          const user: User = {id: id, userName: username, mail: mail, fullName: fullname, age: age, height: height, currentWeight: currentweight, targetWeight: targetweight, changePerWeek: changeperweek, gender: gender, activityRating: activityrating, calorieGoal: caloriegoal, createdOn: createdon}
          res.send({
            statusCode: 200,
            message: 'user loaded',
            payload: user,
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

const updateUser = (server: Express, url: string): Express => {
  return server.put(url, authValidation, async(req, res) => {
    try {
      const {userName, mail, oldPassword, newPassword, fullName, age, height, currentWeight, targetWeight, changePerWeek, activityRating, gender} = req.body.data;
      const {id} = req.body.id;
      const dbResponse = await query('UPDATE users SET activityrating = $1 WHERE id = $2', [activityRating, id]);

      res.status(200).json({
        statusCode: 200,
        message: 'user updated',
      } as AuthResponse);
    } catch (err) {
      throw err;
    }
  });
};

const deleteUser = (server: Express, url: string): Express => {
  return server.delete(url, async(req, res) => {
    try {
      const isTokenValid = await validateSessionToken(req.cookies.SESSIONTOKEN as string);
      if(isTokenValid){
        const {id} = req.query;
        const deleteEntries = await query('DELETE FROM entries WHERE userid = $1', [id]);
        const dbResponse = await query('DELETE FROM users WHERE id = $1', [id]);
        res.clearCookie(getSessionToken());
        res.send({
          statusCode: 200,
          message: 'user deleted',
        } as AuthResponse);
      }else{
        res.send({
          statusCode: 401,
          message: 'not authorized',
        } as AuthResponse);
      }
    } catch (err) {
      throw err;
    }
  }); 
};

export  { loadUserData, updateUser, deleteUser }