import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer">
      <div class="footer-container">
        <p class="copyright">
          &copy; 2025-2026 PMT - Project Management Tool. Tous droits réservés.
        </p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #fff;
      box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem 0;
      margin-top: auto;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      text-align: center;
    }

    .copyright {
      color: #6c757d;
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .footer {
        padding: 0.5rem 0;
      }

      .copyright {
        font-size: 0.75rem;
      }
    }
  `]
})
export class FooterComponent {}
