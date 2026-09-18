import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormComponent } from './task-form';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, MatCardModule, MatToolbarModule, MatTableModule, TaskFormComponent, MatButtonModule, FormsModule, MatSelectModule, MatInputModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class AppComponent implements OnInit {
  private apiService = inject(ApiService);

  backendData = signal<any[]>([]);

  usersList = signal<any[]>([]);
  selectedUserId = signal<number>(0);
  newUsername = '';

  pendingTasks = computed(() => {
    return this.backendData()
      .filter(t => !t.completed)
      .sort((a, b) => b.priority - a.priority || a.id - b.id);
  });

  completedTasks = computed(() => {
    return this.backendData()
      .filter(t => t.completed)
      .sort((a, b) => b.priority - a.priority || a.id - b.id);
  });

  displayedColumns: string[] = ['id', 'priority', 'title', 'acciones'];

  ngOnInit() {
    this.loadUsers(); // Carga inicial
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (users: any) => {
        this.usersList.set(users);
        if (users.length > 0) {
          if (this.selectedUserId() === 0) {
            this.selectedUserId.set(users[0].id);
          }
          this.loadTasks(); // Cargamos las tareas del usuario seleccionado
        }
      },
      error: (err) => console.error('Error al cargar usuarios:', err)
    });
  }

  loadTasks() {
    if (this.selectedUserId() === 0) return;
    this.apiService.getTasksByUser(this.selectedUserId()).subscribe({
      next: (data) => this.backendData.set(data as any[]),
      error: (err) => console.error('Error al conectar:', err)
    });
  }

  // Eventos de la interfaz de usuarios
  onUserChange(userId: number) {
    this.selectedUserId.set(userId);
    this.loadTasks();
  }

  createNewUser() {
    if (!this.newUsername) return;
    this.apiService.createUser({ username: this.newUsername, email: this.newUsername + '@test.com' }).subscribe({
      next: () => {
        this.newUsername = '';
        this.loadUsers();
      },
      error: (err) => console.error('Error al crear usuario:', err)
    });
  }

  // Función para el clic del botón
  toggleTask(task: any) {
    const updatedTask = { ...task, completed: !task.completed };

    this.apiService.updateTask(task.id, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  deleteTask(taskId: number) {
    if (confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      this.apiService.deleteTask(taskId).subscribe({
        next: () => this.loadTasks(), // Recarga la tabla al terminar
        error: (err) => console.error('Error al eliminar:', err)
      });
    }
  }
}