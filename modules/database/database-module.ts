import {Pool} from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool();

export const query = (query: any, properties?: any) => {
  return pool.query(query, properties);
};