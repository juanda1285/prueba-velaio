import { Person } from './person.model';

export interface Task {
    id: number;
    name: string;
    dueDate: Date;
    people: Person[]; // Array de personas asociadas a la tarea
    completed: boolean;
  }