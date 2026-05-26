import { Component, HostListener } from "@angular/core";

@Component({
  selector: "app-navbar",
  imports: [],
  templateUrl: "./navbar.html",
  styleUrl: "./navbar.css",
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

  // Chiude il menu a tendina se si clicca fuori
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    this.isDropdownOpen = false;
  }
}
