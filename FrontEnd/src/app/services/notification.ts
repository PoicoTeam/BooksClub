import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class Notification {
  private nextId = 1;
  private readonly defaultDurationMs = 4500;
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  readonly messages$ = this.messagesSubject.asObservable();

  success(text: string, durationMs = this.defaultDurationMs): void {
    this.show('success', text, durationMs);
  }

  error(text: string, durationMs = this.defaultDurationMs + 1500): void {
    this.show('error', text, durationMs);
  }

  info(text: string, durationMs = this.defaultDurationMs): void {
    this.show('info', text, durationMs);
  }

  warning(text: string, durationMs = this.defaultDurationMs): void {
    this.show('warning', text, durationMs);
  }

  dismiss(id: number): void {
    this.messagesSubject.next(this.messagesSubject.value.filter((m) => m.id !== id));
  }

  private show(type: ToastType, text: string, durationMs: number): void {
    const toast: ToastMessage = { id: this.nextId++, type, text };
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, toast].slice(-4));

    window.setTimeout(() => this.dismiss(toast.id), durationMs);
  }
}
