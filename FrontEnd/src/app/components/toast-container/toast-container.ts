import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification, ToastMessage } from '../../services/notification';

/*
  CONTAINER TOAST (ToastContainerComponent)
  Renderizza i messaggi emessi dal servizio Notification (angolo in alto a destra).
*/
@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
    >
      @for (msg of notification.messages$ | async; track msg.id) {
        <div
          class="pointer-events-auto px-4 py-3 rounded-xl shadow-lg border text-sm font-semibold flex justify-between gap-3 animate-fade-in"
          [ngClass]="toastClass(msg)"
          role="alert"
        >
          <span>{{ msg.text }}</span>
          <button
            type="button"
            class="opacity-70 hover:opacity-100 shrink-0"
            (click)="notification.dismiss(msg.id)"
            aria-label="Chiudi"
          >
            ✕
          </button>
        </div>
      }
    </div>
  `,
  styles: [
    `
      @keyframes fade-in {
        from {
          opacity: 0;
          transform: translateY(-8px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .animate-fade-in {
        animation: fade-in 0.2s ease-out;
      }
    `,
  ],
})
export class ToastContainerComponent {
  readonly notification = inject(Notification);

  toastClass(msg: ToastMessage): Record<string, boolean> {
    return {
      'bg-green-50 border-green-200 text-green-800 dark:bg-green-950/80 dark:border-green-800 dark:text-green-200':
        msg.type === 'success',
      'bg-red-50 border-red-200 text-red-800 dark:bg-red-950/80 dark:border-red-800 dark:text-red-200':
        msg.type === 'error',
      'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-200':
        msg.type === 'warning',
      'bg-sky-50 border-sky-200 text-sky-900 dark:bg-sky-950/80 dark:border-sky-800 dark:text-sky-200':
        msg.type === 'info',
    };
  }
}
