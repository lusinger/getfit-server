import { Express } from "express";
import { existsMail } from "../database/user-queries";
import { signSessionKey } from "../validation/jwt";
import { sendResetMail } from "../mail-service/mail-service";

export const resetPwRequest = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      if('mail' in req.query){
        console.log(req.query);
        const resetToken = req.cookies.RESET_MAIL_TOKEN;
        const {mail} = req.query;
        const doesMailExist = await existsMail(mail as string);
        if(doesMailExist){
          const token = await signSessionKey({mail: mail as string});
          sendResetMail('lukas.singer@outlook.com', token.slice(0, 10));
          res.cookie('RESET_MAIL_TOKEN', token, {
            httpOnly: true,
          });
          res.send({
            statusCode: 200,
            message: 'YOU RECIEVED MAIL IF USER WITH MAIL EXISTS',
            payload: {allowReset: false},
          })
        }
      }
      if('access' in req.query && req.cookies.RESET_MAIL_TOKEN !== undefined){
        if(req.query.access === req.cookies.RESET_MAIL_TOKEN.slice(0, 10)){
          res.send({
            statusCode: 200,
            message: 'PASSWORD_RESET_ALLOWED',
            payload: {allowReset: true},
          });
        }else{
          res.send({
            statusCode: 200,
            message: 'PASSWORD_RESET_NOT_ALLOWED',
            payload: {allowReset: false},
          });
        }
      }
    } catch (err) {
      throw err;
    }
  });
}