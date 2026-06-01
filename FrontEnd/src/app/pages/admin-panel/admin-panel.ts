import { Component, inject, OnInit } from '@angular/core';
import { Admin, AdminStats, AdminUser } from '../../services/admin';
import { CommonModule } from '@angular/common';
import { Notification } from '../../services/notification';
import { getApiErrorMessage } from '../../utils/api-error';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-panel.html',
  styleUrl: './admin-panel.css',
})
export class AdminPanel implements OnInit {
  private adminService = inject(Admin);
  private notification = inject(Notification);

  users: AdminUser[] = [];
  stats: AdminStats | null = null;

  ngOnInit() {
    this.loadAdminData();
  }

  loadAdminData() {
    this.adminService.getStats().subscribe({
      next: (data) => (this.stats = data),
      error: (err) =>
        this.notification.error(
          getApiErrorMessage(err, 'Impossibile caricare le statistiche admin.')
        ),
    });
    this.adminService.getUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) =>
        this.notification.error(getApiErrorMessage(err, 'Impossibile caricare la lista utenti.')),
    });
  }

  handleDelete(id: string) {
    if (confirm('Eliminare questo utente e tutti i suoi libri?')) {
      this.adminService.deleteUser(id).subscribe({
        next: () => {
          this.notification.success('Utente eliminato.');
          this.loadAdminData();
        },
        error: (err) =>
          this.notification.error(getApiErrorMessage(err, 'Errore durante l\'eliminazione.')),
      });
    }
  }

  handleReset(id: string) {
    if (confirm('Resettare la password a 1234@ ?')) {
      this.adminService.resetPassword(id).subscribe({
        next: (res) => this.notification.success(res.message || 'Password resettata.'),
        error: (err) =>
          this.notification.error(getApiErrorMessage(err, 'Errore durante il reset password.')),
      });
    }
  }
}
