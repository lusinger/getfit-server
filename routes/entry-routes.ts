import {Express} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import {getEntry, getEntries, deleteEntry} from '../modules/database/data-queries';
import { validateSessionToken } from '../modules/validation/jwt';

export const getEntryRoute = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      if(await validateSessionToken(req.cookies.LOGIN_TOKEN)){
        const {id} = req.query;
        const data = await getEntry(parseInt(id as string));
    
        if(data !== null){
          res.send({
            data: data,
          });
        }else{
          res.send({
            data: null,
          })
        }
      }
    } catch (err) {
      console.log(err);
    }
  });
}

export const getEntriesRoute = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      const valid = await validateSessionToken(req.cookies.LOGIN_TOKEN);
      if(valid !== null){
        const {year, month, date}: {year: number, month: number, date: number} = req.query as any
        const searchDate = new Date(year, month, date);
  
        const data = await getEntries(searchDate, valid.mail);

        if(data && !data.length){
          const entries = data;
          const breakfast = entries.filter(entry => {return entry.section === 'breakfast' ? true : false});
          const lunch = entries.filter(entry => {return entry.section === 'lunch' ? true : false});
          const dinner = entries.filter(entry => {return entry.section === 'dinner' ? true : false});
          const snack = entries.filter(entry => {return entry.section === 'snack' ? true : false});

          res.send({
            statusCode: 200,
            message: 'RETURNED_FOUND_ENTRIES',
            payload: {
              breakfast: breakfast,
              lunch: lunch,
              dinner: dinner,
              snack: snack,
            },
          });
        }else{
          res.send({
            statusCode: 404,
            message: 'NO_ENTRIES_FOUND',
          });
        }
      }
    } catch (err) {
      if(err instanceof JsonWebTokenError){
        res.send({
          statusCode: 403,
          message: 'SESSION EXPIRED',
        })
      }else{
        throw err;
      }
    }
  });
}

export const deleteEntryRoute = (server: Express, url: string): Express => {
  return server.delete(url, async(req, res) => {
    const valid = await validateSessionToken(req.cookies.LOGIN_TOKEN);
    if(valid !== null){
      console.log(req.query);
      const {id} = req.query;

      const response = await deleteEntry(parseInt(id as string));
      console.log(response);
    
    }
  });
}