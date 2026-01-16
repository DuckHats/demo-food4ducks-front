import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/Auth/auth.service';
import { UserService } from '../../Services/User/user.service';
import { ErrorMessages } from '../../config/errors.config';
import { AlertService } from '../../Services/Alert/alert.service';
import { NavigationConfig } from '../../config/navigation.config';
import { Messages } from '../../config/messages.config';
// App uses session cookies; token constants removed
import { UILabels } from '../../config/ui-labels.config';

import { MatIconModule } from '@angular/material/icon';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatIconModule],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '400ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
  ],
})
export class LoginComponent {
  loginForm: FormGroup;
  alertMessage: string | null = null;
  isSubmitting = false;
  UILabels = UILabels;
  googleAuthUrl: string;
  show2FA = false;
  twoFactorCode = '';
  pendingEmail = '';
  pendingPassword = '';
  isSocialLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      user: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.googleAuthUrl = this.authService.getGoogleAuthUrl();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['error']) {
        if (params['error'] === 'invalid_domain') {
          this.alertService.show(
            'error',
            ErrorMessages.ACCESS_DENIED,
            ErrorMessages.INVALID_DOMAIN
          );
        } else if (params['error'] === 'account_inactive') {
          this.alertService.show('error', ErrorMessages.ACCOUNT_INACTIVE, '');
        }

        // Clear the query parameters from the URL
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });
      }

      // Handle 2FA redirect from Google
      if (
        params['error'] === 'TWO_FACTOR_REQUIRED' &&
        params['is_social'] === 'true' &&
        params['email']
      ) {
        this.show2FA = true;
        this.isSocialLogin = true;
        this.pendingEmail = params['email'];
        // Remove query params
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true,
        });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isSubmitting = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          // Backend uses session cookies (no JWT). On success we fetch current user.
          if (response.status === 200) {
            this.userService.me().subscribe({
              next: (fullUser) => {
                this.authService.checkIfAdmin().subscribe(
                  (isAdmin) => {
                    const message = isAdmin
                      ? Messages.AUTH.WELCOME_ADMIN
                      : Messages.AUTH.WELCOME_USER;
                    this.alertService.show(
                      'success',
                      Messages.AUTH.WELCOME,
                      message
                    );
                    if (isAdmin) {
                      this.router.navigateByUrl(NavigationConfig.ADMIN, {
                        replaceUrl: true,
                      });
                      return;
                    }
                    this.router.navigate([NavigationConfig.HOME]);
                  },
                  () => {
                    this.alertService.show(
                      'success',
                      Messages.AUTH.WELCOME,
                      Messages.AUTH.WELCOME_USER
                    );
                    this.router.navigate([NavigationConfig.HOME]);
                  }
                );
              },
              error: (err) => {
                console.error('Error fetching user:', err);
                this.alertService.show(
                  'error',
                  Messages.USERS.LOADING_ERROR,
                  ''
                );
                this.isSubmitting = false;
              },
            });
          } else {
            this.alertService.show('error', ErrorMessages.LOGIN_FAILED, '');
            this.resetForm();
          }
        },
        error: (error) => {
          let errorMessage = ErrorMessages.INVALID_CREDENTIALS;

          if (error.error && error.error.error) {
            const errorCode = error.error.error.code;
            if (errorCode === 'ACCOUNT_INACTIVE') {
              errorMessage = ErrorMessages.ACCOUNT_INACTIVE;
            } else if (errorCode === 'INVALID_CREDENTIALS') {
              errorMessage = ErrorMessages.INVALID_CREDENTIALS;
            } else if (errorCode === 'TWO_FACTOR_REQUIRED') {
              this.show2FA = true;
              this.pendingEmail = this.loginForm.value.user;
              this.pendingPassword = this.loginForm.value.password;
              this.isSubmitting = false;
              return;
            }
          }

          this.alertService.show('error', errorMessage, '');
          console.error(error);
          this.resetForm();
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    } else {
      this.alertService.show(
        'warning',
        Messages.VALIDATION.REQUIRED_FIELDS,
        ''
      );
    }
  }

  on2FASubmit(): void {
    if (this.twoFactorCode.length === 6) {
      this.isSubmitting = true;
      this.authService
        .loginWith2FA({
          email: this.pendingEmail,
          password: this.pendingPassword,
          code: this.twoFactorCode,
          is_social: this.isSocialLogin,
        })
        .subscribe({
          next: (response) => {
            if (response.status === 200) {
              this.userService.me().subscribe({
                next: (fullUser) => {
                  this.authService.checkIfAdmin().subscribe((isAdmin) => {
                    const message = isAdmin
                      ? Messages.AUTH.WELCOME_ADMIN
                      : Messages.AUTH.WELCOME_USER;
                    this.alertService.show(
                      'success',
                      Messages.AUTH.WELCOME,
                      message
                    );
                    if (isAdmin) {
                      this.router.navigateByUrl(NavigationConfig.ADMIN, {
                        replaceUrl: true,
                      });
                      return;
                    }
                    this.router.navigate([NavigationConfig.HOME]);
                  });
                },
              });
            }
          },
          error: (error) => {
            this.alertService.show(
              'error',
              this.UILabels.PROFILE.TWO_FACTOR_ERROR,
              ''
            );
            this.isSubmitting = false;
          },
        });
    }
  }

  cancel2FA(): void {
    this.show2FA = false;
    this.twoFactorCode = '';
    this.pendingEmail = '';
    this.pendingPassword = '';
    this.isSocialLogin = false;
    this.resetForm();
  }

  forgotPassword(): void {
    this.router.navigate([NavigationConfig.FORGOT_PASSWORD]);
  }

  private resetForm(): void {
    this.loginForm.reset();
    this.isSubmitting = false;
  }

  register(): void {
    this.router.navigate([NavigationConfig.REGISTER]);
  }
}
