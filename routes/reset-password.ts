import { Express } from "express";
import { AuthResponse } from "../interfaces/auth-response";
import { existsMail } from "../modules/database/user-queries";
import { signSessionKey } from "../modules/jwt";

export const resetPassword = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      const {mail} = req.query; 
      let exists: boolean = false;
      let token: string = '';
      const response: AuthResponse = {statusCode: 200, message: 'IF_USER_WITH_MAIL_EXISTS_YOU_RECIEVED_MAIL'};
      if(typeof mail === 'string'){
        exists = await existsMail(mail);
        token = await signSessionKey({mail: mail});
      }else{
      }

      if(exists){
        res.cookie('RESET_MAIL', token, {
          httpOnly: true,
          maxAge: 10,
          secure: true,
        });
        res.send(
          response,
        )
      }else{
        res.send(
          response,
        )
      }
    } catch (err) {
      throw err;
    }
  });
}