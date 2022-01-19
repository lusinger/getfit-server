import {Express} from 'express';
import { validateSessionToken } from '../modules/validation/jwt';

export const getItems = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    console.log(req.query);
    const isValid = await validateSessionToken(req.cookies.LOGIN_TOKEN);

    if(isValid !== null){

    }else{
      res.send({

      })
    }
    res.send({
      id: 1
    });
  });
}