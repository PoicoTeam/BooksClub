import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

/*
  SERVIZIO TEMA (ThemeService)
  Gestisce la modalità chiara/scura aggiungendo la classe "dark" su <html>
  e salvando la preferenza in localStorage.
*/
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);

  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    // ripristina il tema scelto in precedenza dall'utente
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.enableDark();
    }
  }

  toggleTheme() {
    if (this.isDarkSubject.value) {
      this.disableDark();
    } else {
      this.enableDark();
    }
  }

  private enableDark() {
    this.isDarkSubject.next(true);
    this.document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }

  private disableDark() {
    this.isDarkSubject.next(false);
    this.document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}
