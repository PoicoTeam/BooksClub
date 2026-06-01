import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

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
