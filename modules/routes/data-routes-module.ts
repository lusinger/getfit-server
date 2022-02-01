import {Express} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthResponse } from '../../interfaces/auth-response';
import { Entry } from '../../interfaces/entry';
import {updateEntryData, getEntryData, getEntriesData, deleteEntryData, addEntriesData, getItemsData} from '../database/data-queries';
import { validateSessionToken, authValidation } from '../validation/validation-module';

const getEntry = (server: Express, url: string): Express => {
  return server.get(url, authValidation, async(req, res) => {
    try {
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
    }catch (err) {
    }
  });
}

const getEntries = (server: Express, url: string): Express => {
  return server.get(url, authValidation, async(req, res) => {
    try {
      const {year, month, date}: {year: number, month: number, date: number} = req.query as any
      const searchDate = new Date(year, month, date);

      const data = await getEntriesData(searchDate, req.body.tokenValue);
      if(data !== null){
        res.send(data);
      }else{
        res.send({
          data: [],
        });
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
  return server.post(url, authValidation, async(req, res) => {
    const entries = req.body as Entry[];
    const response = await addEntriesData(entries, req.body.tokenValue);

    res.send({
      statusCode: 200,
      message: 'ENTRIES_CREATED',
    });
  });
}

const updateEntry = (server: Express, url: string): Express => {
  return server.put(url, async(req, res) => {
    const valid = await validateSessionToken(req.cookies.SESSIONTOKEN);
    if(valid !== null){
      const entry = req.body as Entry;
      const response = await updateEntryData(entry, valid.mail);

      res.status(200).json({
        statusCode: 200,
        message: 'entry updated',
      } as AuthResponse);
    }
  });
}

const deleteEntry = (server: Express, url: string): Express => {
  return server.delete(url, authValidation, async(req, res) => {
    const response = await deleteEntryData(parseInt(req.query.id as string));
    if(response === true){
      res.status(200).json({
        statusCode: 200,
        message: 'entry deleted',
      } as AuthResponse);
    }else{
      res.status(404).json({
        statusCode: 404,
        message: 'entry not found',
      } as AuthResponse);
    }
  });
}

const getItems = (server: Express, url: string): Express => {
  return server.get(url, authValidation, async(req, res) => {
    const {search, start, end}: {search: string | undefined, start: number | undefined, end: number | undefined} = req.query as any;
    const response = await getItemsData(search, start, end);
    if(response !== null){
      res.status(200).json({
        statusCode: 200,
        message: 'matching entries fetched',
        payload: response,
      } as AuthResponse);
    }else{
      res.status(404).json({
        statusCode: 404,
        message: 'no entries found matching your search',
      } as AuthResponse);
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

export {updateEntry, deleteEntry, addEntries, getEntry, getEntries, getItems, addImage};