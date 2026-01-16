import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { trigger, transition, style, animate } from '@angular/animations';
import { TwoFactorAuthService } from '../../Services/Auth/two-factor-auth.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { UILabels } from '../../config/ui-labels.config';
import { Messages } from '../../config/messages.config';

@Component({
  selector: 'app-two-factor-setup-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './two-factor-setup-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('overlayFade', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('200ms ease-in', style({ opacity: 0 }))]),
    ]),
    trigger('modalScale', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.95) translateY(10px)' }),
        animate(
          '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '200ms ease-in',
          style({ opacity: 0, transform: 'scale(0.98) translateY(5px)' })
        ),
      ]),
    ]),
  ],
})
export class TwoFactorSetupModalComponent {
  @Input() show = false;
  @Input() secret = '';
  @Input() qrCode = '';
  @Output() close = new EventEmitter<void>();
  @Output() setupComplete = new EventEmitter<void>();

  verificationCode = '';
  isVerifying = false;
  protected readonly UILabels = UILabels;
  encodeURIComponent = encodeURIComponent;

  constructor(
    private twoFactorAuthService: TwoFactorAuthService,
    private alertService: AlertService
  ) {}

  onClose() {
    this.verificationCode = '';
    this.close.emit();
  }

  verifyAndEnable() {
    if (!this.verificationCode) return;

    this.isVerifying = true;
    this.twoFactorAuthService.enable2FA(this.verificationCode).subscribe({
      next: () => {
        this.alertService.show(
          'success',
          '2FA Activat',
          "L'autenticació en dos passos s'ha activat correctament."
        );
        this.isVerifying = false;
        this.verificationCode = '';
        this.setupComplete.emit();
      },
      error: () => {
        this.isVerifying = false;
        this.alertService.show(
          'error',
          Messages.GENERIC.ERROR,
          this.UILabels.PROFILE.TWO_FACTOR_ERROR_VERIFY
        );
      },
    });
  }
}
