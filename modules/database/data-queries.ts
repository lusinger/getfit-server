import { query } from './database-module';
import { Item } from '../../interfaces/item';
import { QueryArrayResult } from 'pg';
import { Entry } from '../../interfaces/entry';
import { Recipe } from '../../interfaces/recipe';

export const getItem = async(id: number): Promise<Item | null> => {
  const queryResult = await query('SELECT * FROM items WHERE id = $1', [id]);
  return queryResult.rowCount !== 0 ? queryResult.rows[0] as unknown as Item : null;
};

export const getItems = async(search?: string, start?: number, end?: number): Promise<Item[] | null> => {
  console.log(search, start, end);
  if(search === undefined){
    const queryResult = await query('SELECT * FROM items');
    return queryResult.rowCount !== 0 ? queryResult.rows as unknown as Item[] : null;
  }else{
    if(start !== undefined){
      if(end !== undefined){
        const queryResult = await query('SELECT * FROM items WHERE itemname ~ $1', [search]);
        if(queryResult.rowCount !== 0){
          const data = queryResult.rows.slice(start, end);
          return data.length >= 0 ? data as unknown as Item[] : null;
        }else{
          return null
        }
      }else{
        const queryResult = await query('SELECT * FROM items WHERE itemname ~ $1', [search]);
        if(queryResult.rowCount !== 0){
          const data = queryResult.rows.slice(start);
          return data.length >= 0 ? data as unknown as Item[] : null;
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

export const getEntry = async(id: number): Promise<Entry | null> => {
  try {
    const entryQuery = await query(`SELECT * FROM entries WHERE id = $1`, [id]);
    if(entryQuery.rowCount !== 0){
      const entry = entryQuery.rows[0] as unknown as Entry;
      if(!entry.isrecipe){
        const content = await query(`SELECT * FROM items WHERE id = $1`, [entry.entryid]);
        const item = content.rows[0] as unknown as Item;
        entry.content = item;
        return entry;
      }else{
        const content = await query(`SELECT * FROM recipes WHERE id = $1`, [entry.entryid]);
        const recipe = content.rows[0] as unknown as Recipe;
        entry.content = recipe;
        return entry;
      }
    }else{
      return null;
    }
  } catch (err) {
    throw err;
  }
}

export const getEntries = async(date: Date, mail: string): Promise<Entry[] | null> => {
  try {
    const entriesQuery = await query(`SELECT entries.* FROM entries INNER JOIN users ON entries.userid = users.id WHERE createon = $1 AND users.mail = $2`, [date, mail]);
    if(entriesQuery.rowCount !== 0){
      const entries = entriesQuery.rows as unknown as Entry[];
      entries.forEach(async(entry) => {
        if(entry.isrecipe){
          const content = await query(`SELECT * FROM items WHERE id = $1`, [entry.entryid]);
          const item = content.rows[0] as unknown as Item;
          entry.content = item;
        }else{
          const content = await query(`SELECT * FROM recipes WHERE id = $1`, [entry.entryid]);
          const recipe = content.rows[0] as unknown as Recipe;
          entry.content = recipe;
        }
      });
      return entries;
    }else{
      return null;
    }
  } catch (err) {
    throw err;
  }
}

export const deleteEntry = async(id: number): Promise<QueryArrayResult> => {
  try {
    const dbResponse = await query(`DELETE FROM entries WHERE id = $1`, [id]);
    return dbResponse;
  } catch (err) {
    throw err;
  }
}