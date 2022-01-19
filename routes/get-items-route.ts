import {Express} from 'express';
import { validateSessionToken } from '../modules/validation/jwt';
import * as data from '../modules/database/data-queries';
import { Item } from '../interfaces/item';

export const getItems = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    const search = req.query?.search ? req.query.search as string : undefined;
    const start = req.query?.start ? parseInt(req.query.start as string) : undefined;
    const end = req.query?.end ? parseInt(req.query.end as string) : undefined;
    const isValid = await validateSessionToken(req.cookies.LOGIN_TOKEN);

    console.log(search, start, end);

    if(isValid !== null){
      const response = await data.getItems(search, start, end);
      console.log(response);
      if(response !== null){
        res.send(
          response,
        )
      }else{
        res.send(
          []
        );
      }
    }else{
      res.send(
        []
      );
    }
  });
}