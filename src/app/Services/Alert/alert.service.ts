import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Alert {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  private counter = 0;

  show(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, duration = 3000) {
    const id = ++this.counter;
    const newAlert: Alert = { id, type, title, message };
    const current = this.alertsSubject.value;
    this.alertsSubject.next([...current, newAlert]);

    setTimeout(() => {
      this.alertsSubject.next(this.alertsSubject.value.filter(alert => alert.id !== id));
    }, duration);
  }
}
