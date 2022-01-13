import {getExpTime} from '../modules/jwt';
import dotenv from 'dotenv';
dotenv.config();

describe('getExpTime()', () => {
  it('should return value for JWT_EXP in .env', () => {
    expect(getExpTime()).toEqual(120);
  });
});