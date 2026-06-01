import { Component, inject } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

/*
  LAYOUT AREA AUTENTICATA (AppLayoutComponent)
  Wrapper con navbar, footer e animazione leggera al cambio rotta (dashboard, libri, admin).
*/
@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent],
  templateUrl: './app-layout.html',
})
export class AppLayoutComponent {
  private router = inject(Router);
  pageAnimate = true;

  constructor() {
    // riattiva l'animazione CSS ad ogni NavigationEnd
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.pageAnimate = false;
      requestAnimationFrame(() => {
        this.pageAnimate = true;
      });
    });
  }
}
