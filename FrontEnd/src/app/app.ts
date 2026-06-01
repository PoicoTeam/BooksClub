import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';
import { ToastContainerComponent } from './components/toast-container/toast-container';

/*
  COMPONENTE ROOT (AppComponent)
  Contiene il router-outlet, i toast globali e inizializza il ThemeService all'avvio.
*/
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastContainerComponent],
  template: `
    <app-toast-container />
    <router-outlet />
  `,
})
export class AppComponent {
  // inietta il servizio tema così legge subito la preferenza salvata in localStorage
  constructor(private themeService: ThemeService) {}
}
