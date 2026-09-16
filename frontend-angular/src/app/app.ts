import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './api.service';
import { JsonPipe } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, JsonPipe],
  templateUrl: './app.html', // <-- Apunta a tu archivo HTML
  styleUrl: './app.css'
})
export class AppComponent implements OnInit {
  private apiService = inject(ApiService);
  backendData: any;

  ngOnInit() {
    this.apiService.getTasksByUser(1).subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.backendData = data;
      },
      error: (err) => console.error('Error al conectar:', err)
    });
  }
}