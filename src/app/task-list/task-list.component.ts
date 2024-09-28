import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { selectAllTasks } from '../store/task.selectors';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModalComponent } from '../components/task-modal/task-modal.component';
import { deleteTask } from '../store/task.actions'; // Importa la acción de eliminar

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks$: Observable<Task[]>; // Cambiamos a Observable
  filteredTasks: Task[] = [];

  constructor(private store: Store, private modalService: NgbModal) {
    this.tasks$ = this.store.select(selectAllTasks); // Selecciona las tareas del store
  }

  openEditModal(task: Task): void {
    const modalRef = this.modalService.open(TaskModalComponent);
    modalRef.componentInstance.task = task; // Pasa la tarea seleccionada
  }

  ngOnInit(): void {
    this.tasks$.subscribe(tasks => {
      this.filteredTasks = tasks; // Inicializa filteredTasks con las tareas del store
    });
  }

  filterTasks(status: string): void {
    this.tasks$.subscribe(tasks => {
      if (status === 'all') {
        this.filteredTasks = tasks;
      } else if (status === 'completed') {
        this.filteredTasks = tasks.filter(task => task.completed);
      } else if (status === 'pending') {
        this.filteredTasks = tasks.filter(task => !task.completed);
      }
    });
  }

  deleteTask(taskId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      this.store.dispatch(deleteTask({ taskId })); // Dispara la acción para eliminar
    }
  }
}
