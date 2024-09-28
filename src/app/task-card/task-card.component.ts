import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../models/task.model';
import { Store } from '@ngrx/store';
import { updateTask } from '../store/task.actions';

@Component({
  selector: 'app-task-card',
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.css']
})
export class TaskCardComponent {
  @Input() task!: Task; // El componente recibirá los datos de la tarea como input

  constructor(private store: Store) { }

  confirmComplete(task: Task) {
    if (confirm('¿Finallizar esta tarea?')) {
      this.completeTask(task);
    }
  }

  completeTask(task: Task) {
    const updatedTask = { ...task, completed: !task.completed }; // Crea una copia
    this.store.dispatch(updateTask({ task: updatedTask })); // Actualiza el estado con la tarea modificada
  }

}
