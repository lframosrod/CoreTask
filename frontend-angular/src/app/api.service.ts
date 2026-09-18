import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get('/api/users');
  }

  createUser(user: any) {
    return this.http.post('/api/users', user);
  }

  updateUser(id: number, user: any) {
    return this.http.put(`/api/users/${id}`, user);
  }

  deleteUser(id: number) {
    return this.http.delete(`/api/users/${id}`);
  }

  getTasksByUser(userId: number) {
    return this.http.get(`/api/tasks/user/${userId}`);
  }

  createTask(task: any) {
    return this.http.post('/api/tasks', task);
  }

  updateTask(id: number, task: any) {
    return this.http.put(`/api/tasks/${id}`, task);
  }

  deleteTask(id: number) {
    return this.http.delete(`/api/tasks/${id}`);
  }
}