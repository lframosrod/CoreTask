import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { JsonPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table'; 

// 1. Importamos el componente modular
import { TaskFormComponent } from './task-form'; 

@Component({
  selector: 'app-root',
  standalone: true,
  // 2. Lo agregamos a los imports
  imports: [RouterOutlet, JsonPipe, MatCardModule, MatToolbarModule, MatTableModule, TaskFormComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  
  backendData = signal<any[]>([]); 
  displayedColumns: string[] = ['id', 'title', 'description', 'status'];

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
}