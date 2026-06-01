import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/*
  VALIDATORI FORM (validators)
  Regole riutilizzabili nei form reattivi (es. URL copertina opzionale).
*/

/** URL http/https opzionale: vuoto = valido, valorizzato = deve essere URL assoluto */
export function optionalUrlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = (control.value as string)?.trim();
    if (!value) {
      return null;
    }
    try {
      const url = new URL(value);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return { invalidUrl: true };
      }
      return null;
    } catch {
      return { invalidUrl: true };
    }
  };
}
