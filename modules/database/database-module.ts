import {DatabaseError, Pool} from 'pg';
import fs from 'fs/promises';
import dotenv from 'dotenv';
dotenv.config();

import { Item } from '../../interfaces/interfaces';

const pool = new Pool();

export const query = (query: any, properties?: any) => {
  return pool.query(query, properties);
};

export const initializeDB = async(): Promise<any> => {
  await checkIfUserTableExists();
  await checkIfEntriesTableExists();
  await checkIfItemsTableExists();
}

const checkIfUserTableExists = async(): Promise<void> => {
  try { 
    const doesTableExist = await query('SELECT id FROM users');
  } catch (err) {
    if(err instanceof DatabaseError){
      if(err.code === '42P01'){
        await query(`CREATE TABLE users(
          id SERIAL PRIMARY KEY,
          userName VARCHAR(50) UNIQUE NOT NULL,
          mail VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          fullName VARCHAR(100) NOT NULL,
          age INTEGER NOT NULL,
          height INTEGER NOT NULL,
          currentWeight REAL NOT NULL,
          targetWeight REAL NOT NULL,
          changePerWeek REAL NOT NULL,
          gender VARCHAR(20) NOT NULL,
          activityRating REAL NOT NULL,
          calorieGoal INTEGER NOT NULL,
          createdOn DATE NOT NULL
        )`);
        console.log('[SERVER] users table created');
      }
    }else{
      console.log(err);
    }
  }
}
const checkIfEntriesTableExists = async(): Promise<void> => {
  try {
    const doesTableExist = await query('SELECT id FROM entries');
  } catch (err) {
    if(err instanceof DatabaseError){
      if(err.code === '42P01'){
        await query(`CREATE TABLE entries(
          id SERIAL PRIMARY KEY,
          createdon DATE NOT NULL,
          userid INTEGER NOT NULL,
          entryid INTEGER NOT NULL,
          amount REAL NOT NULL,
          unit VARCHAR(20) NOT NULL,
          isrecipe BOOLEAN NOT NULL,
          section VARCHAR(50) NOT NULL
        )`);
        console.log('[SERVER] entries table created');
      }
    }else{
      console.log(err);
    }
  }
}
const checkIfItemsTableExists = async(): Promise<void> => {
  try {
    const doesTableExist = await query('SELECT id FROM items');
  } catch (err) {
    if(err instanceof DatabaseError){
      if(err.code === '42P01'){
        await query(`CREATE TABLE items(
          id SERIAL PRIMARY KEY,
          itemname VARCHAR(255) NOT NULL,
          protein REAL NOT NULL,
          fat REAL NOT NULL,
          carb REAL NOT NULL,
          perg REAL NOT NULL,
          perml REAL NOT NULL,
          perel REAL NOT NULL
        )`);
        console.log('[SERVER] items table created');
        await populateItemsTable();
      }
    }else{
      console.log(err);
    }
  }
}

const populateItemsTable = async(): Promise<void> => {
  try {
    const data = await fs.readFile(__dirname + '/item-data.json');
    let items = JSON.parse(data.toString()) as Item[];
    for(const item of items){
      query(`INSERT INTO items(itemname, protein, fat, carb, perg, perml, perel)
        VALUES($1, $2, $3, $4, $5, $6, $7)`, 
        [item.itemname, item.protein, item.fat, item.carb, item.perg, item.perml, item.perel]);
    }
  } catch (err) {
    console.log(err);
  }
}