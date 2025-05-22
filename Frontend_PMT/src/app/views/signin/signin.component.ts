import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  credentials = {
    email: '',
    password: '',
  };
  errorMessage = '';
  isLoading = false;

  constructor(private authService: AuthService) {}

  onSignIn() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.authService
      .login(this.credentials.email, this.credentials.password)
      .subscribe({
        next: (token) => {
          this.errorMessage = '';
          this.authService.handleLoginSuccess(token);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Erreur détaillée:', error);
          this.errorMessage = 'Email ou mot de passe incorrect';
          this.isLoading = false;
        },
      });
  }
}
