import {query} from './database-module';
import { User } from '../../interfaces/user';
import { LoginRequest } from '../../interfaces/login-request';
import { RegisterRequest } from '../../interfaces/register-request';

export const existsUser = async(req: LoginRequest): Promise<boolean> => {
  try {
    const dbResponse = await query('SELECT id, username, mail FROM users WHERE username = $1 OR mail = $1', 
      [req.user]);
    return dbResponse.rowCount > 0 ? true : false;
  } catch (err) {
    throw err;
  }
};

export const registerUser = async(req: RegisterRequest, hashedPw: string): Promise<void> => {
  try {
    const {userName, mail, fullName, age, height, currentWeight, targetWeight, changePerWeek, gender} = req;
    const dbResponse = await query(`INSERT INTO users(username, mail, password, fullname, age, height, currentweight, targetweight, changeperweek, gender, caloriegoal) 
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [userName, mail, hashedPw, fullName, age, height, currentWeight, targetWeight, changePerWeek, gender]);
  } catch (err) {
    throw err;
  }
}