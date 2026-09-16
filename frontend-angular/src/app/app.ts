import { Component, inject, OnInit, signal } from '@angular/core'; // <-- Agregamos signal
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { JsonPipe } from '@angular/common'; 
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe, MatCardModule, MatToolbarModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  
  backendData = signal<any>(null); 

  ngOnInit() {
    this.apiService.getTasksByUser(1).subscribe({
      next: (data) => {
        console.log('¡Datos interceptados por Angular!', data);
        // Actualizamos el Signal, lo que fuerza a la pantalla a redibujarse
        this.backendData.set(data); 
      },
      error: (err) => console.error('Error al conectar:', err)
    });
  }
}