import { Item } from "./item";
import { Units } from "../types/units";

export interface Recipe {
  id?: number;
  recipename: string;
  itemids: Item[];
  itemamounts: number[];
  itemunits: Units[]
}
