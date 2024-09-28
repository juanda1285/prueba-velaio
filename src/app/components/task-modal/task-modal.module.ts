import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TaskModalComponent } from './task-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TaskModalComponent],
  imports: [
    CommonModule,
    NgbModalModule,
    ReactiveFormsModule
  ],
  exports: [TaskModalComponent],
})
export class TaskModalModule { }
