import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../services/auth';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
})
export class NavbarComponent implements OnInit {
  @Input() variant: 'app' | 'auth' = 'app';

  private auth = inject(Auth);
  private router = inject(Router);
  private theme = inject(ThemeService);

  isDark$ = this.theme.isDark$;
  username = '';
  isAdmin = false;
  mobileOpen = false;

  ngOnInit() {
    const user = this.auth.currentUserValue;
    if (user) {
      this.applyUser(user.username, user.ruolo);
    } else if (this.variant === 'app') {
      this.auth.checkSession().subscribe({
        next: (res) => {
          if (res.logged && res.username && res.ruolo) {
            this.applyUser(res.username, res.ruolo);
          }
        },
      });
    }
  }

  private applyUser(username: string, ruolo: string) {
    this.username = username;
    this.isAdmin = ruolo === 'admin';
  }

  toggleTheme() {
    this.theme.toggleTheme();
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }

  closeMobile() {
    this.mobileOpen = false;
  }
}
