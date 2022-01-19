import { query } from './database-module';
import { Item } from '../../interfaces/item';

export const getItem = async(id: number): Promise<Item | null> => {
  const queryResult = await query('SELECT * FROM items WHERE id = $1', [id]);
  return queryResult.rowCount !== 0 ? queryResult.rows[0] as unknown as Item : null;
};

export const getItems = async(search?: string, start?: number, end?: number): Promise<Item[] | null> => {
  if(search === undefined){
    const queryResult = await query('SELECT * FROM items');
    return queryResult.rowCount !== 0 ? queryResult.rows as unknown as Item[] : null;
  }else{
    if(typeof start !== 'undefined'){
      if(typeof end !== 'undefined'){
        const queryResult = await query('SELECT * FROM items WHERE itemname ~ $1', [search]);
        if(queryResult.rowCount !== 0){
          const data = queryResult.rows.slice(start, end);
          return data === [] ? data as unknown as Item[] : null;
        }else{
          return null
        }
      }else{
        const queryResult = await query('SELECT * FROM items WHERE itemname ~ $1', [search]);
        if(queryResult.rowCount !== 0){
          const data = queryResult.rows.slice(start);
          return data === [] ? data as unknown as Item[] : null;
        }else{
          return null
        }
      }
    }else{
      const queryResult = await query('SELECT * FROM items WHERE itemname ~ $1', [search]);
      return queryResult.rowCount !== 0 ? queryResult.rows as unknown as Item[] : null; 
    }
  }
};