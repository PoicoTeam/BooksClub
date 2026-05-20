import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly cart = inject(CartService);

  readonly cartCount = computed(() => this.cart.itemCount());
}

