import { query } from './database-module';
import { RegisterRequest, LoginRequest } from '../../interfaces/interfaces';
import { DatabaseError, QueryArrayResult } from 'pg';

const calculateTDEE = (user: RegisterRequest): number => {
  const {age, height, currentWeight, targetWeight, changePerWeek, gender, activityRate} = user;
  let tdee: number = 0;

  if(gender === 'male' && currentWeight !== targetWeight){
    tdee = (66 + (13.7 * currentWeight) + (5 * height) - (6.8 * age)) * activityRate;
  }else if(gender === 'female' && currentWeight !== targetWeight){
    tdee = (655 + (9.6 * currentWeight) + (1.8 * height) - (4.7 * age)) * activityRate;
  }

  if(targetWeight < currentWeight){
    tdee - ((7700 * changePerWeek) / 7);
  }else if(targetWeight > currentWeight){
    tdee + ((7700 * changePerWeek) / 7);
  }

  return Math.floor(tdee);
}

const existsUser = async(req: LoginRequest): Promise<QueryArrayResult | null> => {
  try {
    const dbResponse = await query('SELECT * FROM users WHERE username = $1 OR mail = $1', 
      [req.user]);
    return dbResponse.rowCount === 0 ? null : dbResponse;
  } catch (err) {
    throw err;
  }
};

const existsMail = async(mail: string): Promise<boolean> => {
  try {
    const dbResponse = await query('SELECT mail FROM users WHERE mail = $1', [mail]);
    return dbResponse.rowCount > 0 ? true : false;
  } catch (err) {
    throw err;
  }
}

const registerUser = async(req: RegisterRequest, hashedPw: string): Promise<number> => {
  try {
    const {userName, mail, fullName, age, height, currentWeight, targetWeight, changePerWeek, gender, activityRate} = req;
    const tdee = calculateTDEE(req);

    const date = new Date();
    
    const dbResponse = await query(`INSERT INTO users(username, mail, password, fullname, age, height, currentweight, targetweight, changeperweek, gender, activityrating, caloriegoal, createdon) 
    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [userName, mail, hashedPw, fullName, age, height, currentWeight, targetWeight, changePerWeek, gender, activityRate, tdee, date.toISOString()]);
    return 0;
  } catch (err) {
    if(err instanceof DatabaseError && err.code){
      return parseInt(err.code);
    }else{
      throw err;
    }
  }
};

export {existsUser, existsMail, registerUser, calculateTDEE};