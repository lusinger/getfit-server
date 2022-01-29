import {Express} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import { AuthResponse } from '../../interfaces/auth-response';
import { Entry } from '../../interfaces/entry';
import { getEntryData, getEntriesData, deleteEntryData, addEntriesData, getItemsData} from '../database/data-queries';
import { authValidation } from '../validation/validation-module';

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
    const search = req.query?.search ? req.query.search as string : undefined;
    const start = req.query?.start ? parseInt(req.query.start as string) : undefined;
    const end = req.query?.end ? parseInt(req.query.end as string) : undefined;
    
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