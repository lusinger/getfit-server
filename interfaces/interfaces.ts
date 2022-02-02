import { Sections, Units } from "../types/types";

interface AuthResponse {
  statusCode: number;
  message: string;
  payload?: any;
}
interface Entry {
  id?: number;
  createdon: Date;
  userid: number;
  entryid: number;
  amount: number;
  unit: Units;
  isrecipe: boolean;
  section: Sections;
  content: Item | Recipe;
}
interface Recipe {
  id?: number;
  recipename: string;
  itemids: Item[];
  itemamounts: number[];
  itemunits: Units[]
}
interface Item {
  id?: number;
  itemname: string;
  protein: number;
  fat: number;
  carb: number;
  perg: number;
  perml: number;
  perel: number;
}
interface LoginRequest {
  user: string;
  password: string;
}
interface RegisterRequest{
  userName: string;
  mail: string;
  password: string;
  fullName: string;
  age: number;
  height: number;
  currentWeight: number;
  targetWeight: number;
  changePerWeek: number;
  gender: 'male' | 'female';
  activityRate: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
}
interface User{
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
  activityRating?: 1.2 | 1.375 | 1.55 | 1.725 | 1.9;
  calorieGoal?: number;
  createdOn?: Date;
}

export {User, RegisterRequest, LoginRequest, Item, Recipe, Entry, AuthResponse};

