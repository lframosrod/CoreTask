import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select'; // <-- Nuevo Import
import { ApiService } from './api.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  // Agregar MatSelectModule a los imports
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatSelectModule],
  templateUrl: './task-form.html'
})
export class TaskFormComponent {
  private apiService = inject(ApiService);
  @Output() taskCreated = new EventEmitter<void>();
  @Input() currentUserId!: number;

  // Agregamos priority por defecto en 1 (Baja)
  newTask = { title: '', description: '', priority: 1 };

  submitTask() {
    if (!this.newTask.title) return;

    const taskPayload = {
      title: this.newTask.title,
      description: this.newTask.description,
      completed: false,
      priority: this.newTask.priority,
      user: { id: this.currentUserId }
    };

    this.apiService.createTask(taskPayload).subscribe({
      next: () => {
        this.newTask = { title: '', description: '', priority: 1 };
        this.taskCreated.emit();
      },
      error: (err) => console.error('Error al crear tarea:', err)
    });
  }
}