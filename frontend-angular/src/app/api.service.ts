import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  
  // Gracias a Nginx, solo usamos la ruta relativa /api/...
  getUsers() {
    return this.http.get('/api/users');
  }

  getTasksByUser(userId: number) {
    return this.http.get(`/api/tasks/user/${userId}`);
  }
}