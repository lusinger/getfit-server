import { Router} from 'express';
import { getItemsData} from '../database/data-queries';
import { authValidation } from '../validation/validation-module';
import { AuthResponse } from '../../interfaces/interfaces';

const itemRouter = Router();

itemRouter.get('/items', authValidation, async(req, res) => {
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


export {itemRouter};