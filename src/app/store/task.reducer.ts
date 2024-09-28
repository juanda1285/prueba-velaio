import { createReducer, on } from '@ngrx/store';
import { addTask, updateTask, deleteTask} from './task.actions';
import { Task } from '../models/task.model';

export interface TaskState {
  tasks: Task[];
}

const initialState: TaskState = {
  tasks: [
    // {
    //   id: 1,
    //   name: 'Tarea de prueba',
    //   dueDate: new Date('2024-12-01'),
    //   people: [
    //     { name: 'Juanito', age: 25, skills: ['Angular', 'React', 'vue'] }
    //   ],
    //   completed: false
    // }
  ] // Tarea inicial para pruebas
};

export const taskReducer = createReducer(
  initialState,
  on(addTask, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task]
  })),
  on(updateTask, (state, { task }) => {
    // Reemplaza la tarea específica en el estado
    const updatedTasks = state.tasks.map(t => 
      t.id === task.id ? { ...t, ...task } : t
    );
    return { ...state, tasks: updatedTasks };
  }),
  on(deleteTask, (state, { taskId }) => ({
    ...state,
    tasks: state.tasks.filter(t => t.id !== taskId)
  })),
);
