import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskCardComponent } from './task-card/task-card.component';
import { TaskModalModule } from './components/task-modal/task-modal.module';
import { StoreModule } from '@ngrx/store';
import { taskReducer } from './store/task.reducer';

@NgModule({
  declarations: [
    AppComponent,
    TaskListComponent,
    TaskCardComponent
  ],
  imports: [
    HeaderComponent,
    FooterComponent,
    BrowserModule,
    TaskModalModule,
    StoreModule.forRoot({ tasks: taskReducer })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
