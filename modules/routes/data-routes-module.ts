import {Express} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { Entry } from '../../interfaces/entry';
import {getEntry, getEntries, deleteEntry, addEntries} from '../database/data-queries';
import { validateSessionToken } from '../validation/jwt';

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
        if(data !== null){
          console.log('hello');
          res.send(data);
        }else{
          console.log('not hello');
          res.send({
            data: [],
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

export const addEntriesRoute = (server: Express, url: string): Express => {
  return server.post(url, async(req, res) => {
    const valid = await validateSessionToken(req.cookies.LOGIN_TOKEN);
    if(valid !== null){
      const entries = req.body as Entry[];
      console.log(entries);
      const response = await addEntries(entries, valid.mail);

      res.send({
        statusCode: 200,
        message: 'ENTRIES_CREATED',
      })
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

const getItems = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    const search = req.query?.search ? req.query.search as string : undefined;
    const start = req.query?.start ? parseInt(req.query.start as string) : undefined;
    const end = req.query?.end ? parseInt(req.query.end as string) : undefined;
    const isValid = await validateSessionToken(req.cookies.LOGIN_TOKEN);

    console.log(search, start, end);

    if(isValid !== null){
      const response = await data.getItems(search, start, end);
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

export {deleteEntry, addEntries, getEntry, getEntries, getItems};