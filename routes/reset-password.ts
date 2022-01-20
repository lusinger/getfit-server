import {Express} from 'express';
import {query} from '../modules/database/database-module'
import bcrypt from 'bcrypt';
import { validateSessionToken } from '../modules/validation/jwt';
import { comparePw } from '../modules/pw-encription';
import { encryptPw } from '../modules/pw-encription';

export const resetPw = (server: Express, url: string): Express => {
  return server.put(url, async(req, res) => {
    try {
      const {newPassword} = req.body;
      const token = req.cookies.RESET_MAIL_TOKEN;
      const validation = await validateSessionToken(token);
      const dbResponse = await query('SELECT password FROM users WHERE mail = $1', [validation.mail]);
      const object = dbResponse.rows[0] as any;
      if('password' in object){
        console.log(validation.mail);
        console.log(object.password);
        console.log(newPassword);
        const areEqual = await comparePw(newPassword, object.password);
        if(areEqual){
          console.log('new cant be old');
          res.send({
            statusCode: 409,
            message: 'NEW PASSWORD CANT BE OLD PASSWORD',
          });
        }else if(!areEqual){
          console.log('reset');
          const hashedPw = await encryptPw(object.password);
          console.log(hashedPw);
          const dbRepsonse = await query('UPDATE users SET password = $1 WHERE mail = $2', [hashedPw, validation.mail]);
          res.clearCookie('RESET_MAIL_TOKEN');
          res.send({
            statusCode: 200,
            message: 'PASSWORD RESET',
          });
        }else{
          console.log('error');
        }
      }
    } catch (err) {
      
    }
  });
}  