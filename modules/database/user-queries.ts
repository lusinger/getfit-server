import {query} from './database-module';
import { User } from '../../interfaces/user';

export const existsUser = async(): Promise<User | null> => {
  try {
    const dbResponse = await query('SELECT id, username, mail FROM users');
    if(dbResponse.rowCount > 0){
      const user: User[] = dbResponse.rows[0] as User[];
      return user[0];
    }else{
      return null;
    }
  } catch (err) {
    throw err;
  }
};