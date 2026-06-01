import { Injectable, inject } from '@angular/core'; // Aggiunto inject
import { DOCUMENT } from '@angular/common';         // Aggiunto DOCUMENT
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Iniettiamo il documento usando la funzione inject globale
  private document = inject(DOCUMENT);

  private isDarkSubject = new BehaviorSubject<boolean>(false);
  isDark$ = this.isDarkSubject.asObservable();

  constructor() {
    // Ora il costruttore è pulito e sicuro
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