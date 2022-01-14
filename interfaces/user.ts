import { Entry } from "./entry";

export interface User{
  id?: number;
  userName?: string;
  mail?: string;
  password?: string;
  fullName?: string;
  age?: number;
  height?: number;
  currentWeight?: number;
  targetWeight?: number;
  changePerWeek?: number;
  gender?: 'male' | 'female';
  calorieGoal?: number;
  entries?: Entry[];
}