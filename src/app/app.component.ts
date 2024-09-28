import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskModalComponent } from './components/task-modal/task-modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'prueba-velaio';

  constructor(private modalService: NgbModal) {}

  openTaskModal() {
    const modalRef = this.modalService.open(TaskModalComponent);
  }

}
