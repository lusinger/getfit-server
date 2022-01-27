import {Express} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthResponse } from '../../interfaces/auth-response';
import { Entry } from '../../interfaces/entry';
import {getEntryData, getEntriesData, deleteEntryData, addEntriesData, getItemsData} from '../database/data-queries';
import { validateSessionToken } from '../validation/validation-module';

const getEntry = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      if(await validateSessionToken(req.cookies.SESSIONTOKEN)){
        const {id} = req.query;
        const data = await getEntryData(parseInt(id as string));
    
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
    }
  });
}

const getEntries = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    try {
      const valid = await validateSessionToken(req.cookies.SESSIONTOKEN);
      if(valid !== null){
        const {year, month, date}: {year: number, month: number, date: number} = req.query as any
        const searchDate = new Date(year, month, date);
  
        const data = await getEntriesData(searchDate, valid.mail);
        if(data !== null){
          res.send(data);
        }else{
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

const addEntries = (server: Express, url: string): Express => {
  return server.post(url, async(req, res) => {
    const valid = await validateSessionToken(req.cookies.SESSIONTOKEN);
    if(valid !== null){
      const entries = req.body as Entry[];
      const response = await addEntriesData(entries, valid.mail);

      res.send({
        statusCode: 200,
        message: 'ENTRIES_CREATED',
      })
    }
  });
}

const deleteEntry = (server: Express, url: string): Express => {
  return server.delete(url, async(req, res) => {
    const valid = await validateSessionToken(req.cookies.SESSIONTOKEN);
    if(valid !== null){
      const {id} = req.query;

      const response = await deleteEntryData(parseInt(id as string));
      
      res.send({
        statusCode: 200,
        message: 'entry deleted',
      } as AuthResponse)
    }
  });
}

const getItems = (server: Express, url: string): Express => {
  return server.get(url, async(req, res) => {
    const search = req.query?.search ? req.query.search as string : undefined;
    const start = req.query?.start ? parseInt(req.query.start as string) : undefined;
    const end = req.query?.end ? parseInt(req.query.end as string) : undefined;
    const isValid = await validateSessionToken(req.cookies.SESSIONTOKEN);

    if(isValid !== null){
      const response = await getItemsData(search, start, end);
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

const addImage = (server: Express, url: string): Express => {
  return server.post(url, async(req, res) => {
    try {
    } catch (err) {
    }
  });
}

export {deleteEntry, addEntries, getEntry, getEntries, getItems, addImage};