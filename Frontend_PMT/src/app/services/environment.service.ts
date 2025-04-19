import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private apiUrl = 'http://localhost:8080/api';

  constructor() { }

  getApiUrl(): string {
    return this.apiUrl;
  }
} 