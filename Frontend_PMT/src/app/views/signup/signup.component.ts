import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  credentials = {
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  };
  errorMessage = '';
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  onSignUp() {
    if (this.isLoading) return;
    
    if (this.credentials.password !== this.credentials.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.signup(
      this.credentials.email,
      this.credentials.username,
      this.credentials.password
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/signin']);
      },
      error: (error) => {
        const errorMessage = error.error?.message || '';
        if (errorMessage === 'Email already exists') {
          this.errorMessage = 'Cet email est déjà utilisé';
        } else if (errorMessage === 'Username already exists') {
          this.errorMessage = 'Ce nom d\'utilisateur est déjà utilisé';
        } else if (errorMessage === 'Password cannot be null or blank') {
          this.errorMessage = 'Le mot de passe ne peut pas être vide';
        } else {
          this.errorMessage = 'Une erreur est survenue lors de l\'inscription';
        }
        this.isLoading = false;
      }
    });
  }
}
