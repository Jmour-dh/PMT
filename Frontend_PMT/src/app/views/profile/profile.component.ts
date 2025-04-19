import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <h1>Profil</h1>
      <p>Vérifiez la console pour voir les données</p>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getUserProfile().subscribe({
      next: (response) => {
        console.log('Réponse de /me:', response);
      },
      error: (error) => {
        console.error('Erreur lors de la requête /me:', error);
      }
    });
  }
}
