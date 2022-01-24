import { Item } from "./item";
import { Recipe } from "./recipe";
import { Units } from "../types/units";
import { Sections } from "../types/sections";
export interface Entry {
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