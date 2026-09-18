import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { JsonPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table'; 
import { MatButtonModule } from '@angular/material/button';

// 1. Importamos el componente modular
import { TaskFormComponent } from './task-form'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Lo agregamos a los imports
  imports: [RouterOutlet, JsonPipe, MatCardModule, MatToolbarModule, MatTableModule, TaskFormComponent, MatButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  
  backendData = signal<any[]>([]); 
  displayedColumns: string[] = ['id', 'title', 'description', 'status', 'acciones'];

  ngOnInit() {
    this.loadTasks(); // Carga inicial
  }

  // 3. Extraemos la petición a una función propia
  loadTasks() {
    this.apiService.getTasksByUser(1).subscribe({
      next: (data) => {
        this.backendData.set(data as any[]); 
      },
      error: (err) => console.error('Error al conectar:', err)
    });
  }

  // 4. Función para el clic del botón
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