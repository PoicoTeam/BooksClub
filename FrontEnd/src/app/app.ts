import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  // Iniettiamo il servizio del tema per assicurarci che venga inizializzato subito
  constructor(private themeService: ThemeService) {}
}