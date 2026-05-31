import { Component, HostListener, ViewEncapsulation } from "@angular/core";


@Component({
  selector: "app-navbar",
  imports: [],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
  encapsulation: ViewEncapsulation.None
})
export class Navbar {
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.isDropdownOpen = false;
  }
}
