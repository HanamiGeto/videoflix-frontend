import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  text: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  undoCallback?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  toast$ = this.toastSubject.asObservable();

  showToast(toast: ToastMessage) {
    this.toastSubject.next(toast);

    setTimeout(() => {
      this.clearToast();
    }, toast.duration || 5000);
  }

  clearToast() {
    this.toastSubject.next(null);
  }
}
