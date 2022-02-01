import { query } from './database-module';
import { Item } from '../../interfaces/item';
import { QueryArrayResult } from 'pg';
import { Entry } from '../../interfaces/entry';
import { Recipe } from '../../interfaces/recipe';

export const getItem = async(id: number): Promise<Item | null> => {
  const queryResult = await query('SELECT * FROM items WHERE id = $1', [id]);
  return queryResult.rowCount !== 0 ? queryResult.rows[0] as unknown as Item : null;
};

export const getItemsData = async(search?: string, start?: number, end?: number): Promise<Item[] | null> => {
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

export const getEntryData = async(id: number): Promise<Entry | null> => {
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

export const getEntriesData = async(date: Date, mail: string): Promise<Entry[] | null> => {
  try {
    const entriesQuery = await query(`SELECT entries.* FROM entries INNER JOIN users ON entries.userid = users.id WHERE entries.createdon = $1 AND users.mail = $2`, [date, mail]);
    if(entriesQuery.rowCount !== 0){
      const entries = entriesQuery.rows as unknown as Entry[];
      for(const entry of entries){
        if(entry.isrecipe === true){
          const content = await query(`SELECT * FROM recipes WHERE id = $1`, [entry.entryid]);
          const recipe = content.rows[0] as unknown as Recipe;
          entry.content = recipe;
        }else{
          const content = await query(`SELECT * FROM items WHERE id = $1`, [entry.entryid]);
          const items = content.rows[0] as unknown as Item;
          entry.content = items;
        }
      }
      return entries;
    }else{
      return null;
    }
  } catch (err) {
    throw err;
  }
}

export const updateEntryData = async(entry: Entry, mail: string): Promise<any> => {
  try {
    const dbResponse = await query('UPDATE entries SET amount = $1, unit = $2 WHERE id = $3', 
      [entry.amount, entry.unit, entry.id]);
  } catch (err) {
    throw err;
  }
}

export const addEntriesData = async(entries: Entry[], mail: string): Promise<any> => {
  try {
    entries.forEach(async(entry) => {
      const {createdon, userid, entryid, amount, unit, isrecipe, section} = entry;
      const response = await query(`INSERT INTO entries(createdon, userid, entryid, amount, unit, isrecipe, section) 
        VALUES($1, $2, $3, $4, $5, $6, $7)`, [createdon, userid, entryid, amount, unit, isrecipe, section]);  
    });
  } catch (err) {
    throw err;
  }
}

export const deleteEntryData = async(id: number): Promise<boolean> => {
  const response = await query(`DELETE FROM entries WHERE id = $1`, [id]);
  return response.rowCount > 0 ? true : false;
}