import { Component, inject, OnInit } from '@angular/core';
import { toastAnimation } from '../shared/animations';
import { ToastMessage, ToastService } from '../shared/toast.service';

@Component({
  selector: 'vf-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [toastAnimation],
})
export class ToastComponent implements OnInit {
  private toastService = inject(ToastService);
  toast: ToastMessage | null = null;

  ngOnInit(): void {
    this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
    });
  }

  removeToast() {
    this.toastService.clearToast();
  }

  undoAction() {
    if (this.toast?.undoCallback) {
      this.toast.undoCallback();
    }
    this.removeToast();
  }
}
