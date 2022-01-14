import bcrypt from 'bcrypt';
import dotenv, { parse } from 'dotenv';
dotenv.config();

const getSaltRounds = (): number => {
  return process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS) : 10;
};

export const encryptPw = async(password: string): Promise<string> => {
  try {
    return await bcrypt.hash(password, getSaltRounds());
  } catch (err) {
    throw err;
  }
};

export const comparePw = async(rawPassword: string, hashedPassword: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(rawPassword, hashedPassword);
  } catch (err) {
    throw err;
  }
};