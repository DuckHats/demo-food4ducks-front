import { Component } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { AlertComponent } from '../alert/alert.component';
import { AlertService } from '../../Services/Alert/alert.service';

@Component({
  standalone: true,
  selector: 'app-alert-container',
  templateUrl: './alert-container.component.html',
  imports: [NgFor, AsyncPipe, AlertComponent],
})
export class AlertContainerComponent {
  alerts$;
  constructor(private alertService: AlertService) {
    this.alerts$ = this.alertService.alerts$;
  }
}
