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
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, MatCardModule, MatToolbarModule, MatTableModule, TaskFormComponent, MatButtonModule, FormsModule, MatSelectModule, MatInputModule, MatMenuModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class AppComponent implements OnInit {
  private apiService = inject(ApiService);

  backendData = signal<any[]>([]);

  usersList = signal<any[]>([]);
  selectedUserId = signal<number>(0);
  newUsername = '';
  editingUser = signal<boolean>(false);
  editUsername = '';

  pendingTasks = computed(() => {
    return this.backendData()
      .filter(t => (t.status || (t.completed ? 'COMPLETADA' : 'PENDIENTE')) === 'PENDIENTE')
      .sort((a, b) => b.priority - a.priority || a.id - b.id);
  });

  inProgressTasks = computed(() => {
    return this.backendData()
      .filter(t => t.status === 'EN_PROCESO')
      .sort((a, b) => b.priority - a.priority || a.id - b.id);
  });

  completedTasks = computed(() => {
    return this.backendData()
      .filter(t => (t.status || (t.completed ? 'COMPLETADA' : 'PENDIENTE')) === 'COMPLETADA')
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

  startEditUser() {
    const user = this.usersList().find(u => u.id === this.selectedUserId());
    if (user) {
      this.editUsername = user.username;
      this.editingUser.set(true); // Cambiamos la interfaz a modo edición
    }
  }

  saveEditUser() {
    if (!this.editUsername) return;
    this.apiService.updateUser(this.selectedUserId(), { username: this.editUsername }).subscribe({
      next: () => {
        this.editingUser.set(false);
        this.loadUsers(); // Recarga la lista para mostrar el nuevo nombre
      },
      error: (err) => console.error('Error al editar usuario:', err)
    });
  }

  deleteCurrentUser() {
    if (confirm('🚨 ¿Estás seguro de eliminar este perfil? Se borrarán TODAS sus tareas permanentemente.')) {
      this.apiService.deleteUser(this.selectedUserId()).subscribe({
        next: () => {
          this.selectedUserId.set(0); // Reiniciamos la selección
          this.loadUsers(); // Recarga la lista
        },
        error: (err) => console.error('Error al eliminar usuario:', err)
      });
    }
  }

  // Función para menú desplegable
  changeTaskStatus(task: any, newStatus: string) {
    const updatedTask = { ...task, status: newStatus };
    this.apiService.updateTask(task.id, updatedTask).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.error('Error al actualizar estado:', err)
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