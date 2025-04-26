import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = '/api/tasks/'; 

  constructor(private http: HttpClient) {}

  createTask(task: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(this.apiUrl, task, { headers });
  }

  assignTask(projectId: number, taskId: number, userId: number): Observable<any> {
    const token = localStorage.getItem('token')
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });

    return this.http.patch(`${this.apiUrl}${projectId}/${taskId}/assign/${userId}`, {}, { headers })
  }

getTaskHistory(taskId: number): Observable<any[]> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<any[]>(`api/task-history/${taskId}`, { headers });
}

updateTask(taskId: number, updatedTask: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  return this.http.put(`${this.apiUrl}${taskId}`, updatedTask, { headers });
}

deleteTask(taskId: number, userId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  });

  // Ajout du userId en tant que paramètre de requête
  return this.http.delete(`${this.apiUrl}${taskId}?userId=${userId}`, { headers });
}
}

