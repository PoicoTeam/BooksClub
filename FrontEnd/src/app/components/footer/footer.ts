import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

/*
  COMPONENTE FOOTER (FooterComponent)
  Piè di pagina con link rapidi; variant diversa per area auth o app.
*/
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
})
export class FooterComponent {
  @Input() variant: 'app' | 'auth' = 'app';
  readonly year = new Date().getFullYear();
}
