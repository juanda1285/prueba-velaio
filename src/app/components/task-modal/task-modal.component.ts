import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Task } from 'src/app/models/task.model';
import { addTask, updateTask } from 'src/app/store/task.actions';
import { DatePipe } from '@angular/common';
import { selectAllTasks } from 'src/app/store/task.selectors';
import { take } from 'rxjs';

@Component({
  selector: 'app-task-modal',
  templateUrl: './task-modal.component.html',
  styleUrls: ['./task-modal.component.css'],
  providers: [DatePipe]
})
export class TaskModalComponent implements OnInit {
  @Input() task: Task | null = null;  // Si es nulo, es una nueva tarea; si no, se edita
  taskForm!: FormGroup;
  minDate!: string;
  hasDuplicateNames = false;

  constructor(
    public activeModal: NgbModal,
    private fb: FormBuilder,
    private store: Store,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

    this.initForm();
    if (this.task) {
      this.loadTaskData();
    }

    this.taskForm.valueChanges.subscribe(() => {
      this.hasDuplicateNames = this.validateUniquePersonNames();
    });
  }

  // Inicializar el formulario reactivo
  initForm() {
    this.taskForm = this.fb.group({
      name: ['', Validators.required],
      dueDate: ['', Validators.required],
      people: this.fb.array([])  // Aquí irán las personas asociadas
    });
  }

  // Cargar los datos de la tarea si es para edición
  loadTaskData() {
    //Formateo de la fecha para cargarla al formulario
    const formattedDate = this.datePipe.transform(this.task?.dueDate, 'yyyy-MM-dd');

    this.taskForm.patchValue({
      name: this.task?.name,
      dueDate: formattedDate
    });
    this.task?.people.forEach(person => {
      this.addPerson(person.name, person.age, person.skills);
    });
  }

  // Obtener el array de personas
  get people(): FormArray {
    return this.taskForm.get('people') as FormArray;
  }

  validateUniquePersonNames(): boolean {
    const people = this.taskForm.get('people') as FormArray;
    const names = people.controls.map(person => person.get('name')?.value);

    // Verificar si existen nombres duplicados
    const uniqueNames = new Set(names);
    return uniqueNames.size !== names.length;
  }

  // Crear un grupo para una persona con habilidades
  newPerson(name = '', age: number = 0, skills: string[] = []): FormGroup {
    return this.fb.group({
      name: [name, [Validators.required, Validators.minLength(5)]],
      age: [age, [Validators.required, Validators.min(18)]],
      skills: this.fb.array(skills.map(skill => this.fb.control(skill, Validators.required)))
    });
  }

  // Añadir una nueva persona al array
  addPerson(name = '', age: number = 0, skills: string[] = ['']): void {
    this.people.push(this.newPerson(name, age, skills));
  }

  // Eliminar una persona
  removePerson(index: number): void {
    this.people.removeAt(index);
  }

  // Obtener el array de habilidades para una persona específica
  getSkillsControls(personIndex: number): FormArray {
    return this.people.at(personIndex).get('skills') as FormArray;
  }

  addSkill(personIndex: number) {
    const skillsArray = this.getSkillsControls(personIndex);
    skillsArray.push(this.fb.control('', Validators.required));
  }

  removeSkill(personIndex: number, skillIndex: number) {
    const skillsArray = this.getSkillsControls(personIndex);
    skillsArray.removeAt(skillIndex);
  }

  // Guardar la tarea
  saveTask(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const taskData = this.taskForm.value;

    if (this.task) {
      // Si estás editando una tarea, despacha la actualización
      this.store.dispatch(updateTask({ task: { ...this.task, ...taskData } }));
    } else {
      this.store.select(selectAllTasks).pipe(take(1)).subscribe(existingTasks => {
        const maxId = existingTasks.length > 0 ? Math.max(...existingTasks.map(t => t.id)) : 0;

        // Crea un nuevo objeto en lugar de modificar taskData directamente
        const newTask = { ...taskData, id: maxId + 1 };
        this.store.dispatch(addTask({ task: newTask })); // Despacha la nueva tarea
      });
    }
    this.activeModal.dismissAll();
  }


}
