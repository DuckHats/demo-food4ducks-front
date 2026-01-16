import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-alert',
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() type: 'success' | 'error' | 'info' | 'warning' = 'success';
  @Input() title = '';
  @Input() message = '';
}
