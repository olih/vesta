import { Recipe } from './recipe';
import { Task } from './task';

interface Schedule {
  date: string;
  date_human: string;
  events: Task[];
  casual_tasks: Task[];
  occasional_tasks: Task[];
  shopping: Task[];
  lunch: Recipe;
  supper: Recipe;
}

export { Schedule };
