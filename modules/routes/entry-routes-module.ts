import { Router} from 'express';
import { JsonWebTokenError } from 'jsonwebtoken';
import {updateEntryData, getEntryData, getEntriesData, deleteEntryData, addEntriesData, getItemsData} from '../database/data-queries';
import { validateSessionToken, authValidation } from '../validation/validation-module';
import { AuthResponse, Entry } from '../../interfaces/interfaces';

const entryRouter = Router();

entryRouter.get('/', authValidation, async(req, res) => {
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

entryRouter.get('/entries', authValidation, async(req, res) => {
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

entryRouter.post('/create', authValidation, async(req, res) => {
  const entries = req.body as Entry[];
  const response = await addEntriesData(entries, req.body.tokenValue);

  res.send({
    statusCode: 200,
    message: 'ENTRIES_CREATED',
  });
});

entryRouter.put('/update', authValidation, async(req, res) => {
  const token = await validateSessionToken(req.cookies.SESSIONTOKEN);
  const entry = req.body as Entry;
  const response = await updateEntryData(entry, token!.mail);

  res.status(200).json({
    statusCode: 200,
    message: 'entry updated',
  } as AuthResponse);
});

entryRouter.delete('/delete', authValidation, async(req, res) => {
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

export {entryRouter};