import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from './api.service';

// 1. Agregamos la importación del módulo de tarjetas
import { MatCardModule } from '@angular/material/card'; 

@Component({
  selector: 'app-task-form',
  standalone: true,
  // 2. Lo añadimos a la lista de imports
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule],
  templateUrl: './task-form.html'
})
export class TaskFormComponent {
  private apiService = inject(ApiService);
  
  @Output() taskCreated = new EventEmitter<void>();

  newTask = { title: '', description: '' };

  submitTask() {
    if (!this.newTask.title) return;
    
    const taskPayload = {
      title: this.newTask.title,
      description: this.newTask.description,
      completed: false,
      user: { id: 1 }
    };

    this.apiService.createTask(taskPayload).subscribe({
      next: () => {
        this.newTask = { title: '', description: '' };
        this.taskCreated.emit();
      },
      error: (err) => console.error('Error al crear tarea:', err)
    });
  }
}