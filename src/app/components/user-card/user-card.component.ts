import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/User/user.service';
import { User } from '../../interfaces/user';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AuthService } from '../../Services/Auth/auth.service';
import { AllergyService } from '../../Services/Allergy/allergy.service';
import { AlertService } from '../../Services/Alert/alert.service';
import { Allergy } from '../../interfaces/allergy';
import { forkJoin } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { Messages } from '../../config/messages.config';
import { AppConstants } from '../../config/app-constants.config';
import { AssetsConfig } from '../../config/assets.config';
import { AdminConfigurationComponent } from '../../views/admin-configuration/admin-configuration.component';
import { SidebarService } from '../../Services/Sidebar/sidebar.service';
import { UILabels } from '../../config/ui-labels.config';
import { TwoFactorAuthService } from '../../Services/Auth/two-factor-auth.service';
import { TwoFactorSetupModalComponent } from '../two-factor-setup-modal/two-factor-setup-modal.component';

import { ViewEncapsulation } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';

import { TransactionHistoryComponent } from '../../views/transaction-history/transaction-history.component';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  standalone: true,
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
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatFormFieldModule,
    AdminConfigurationComponent,
    TransactionHistoryComponent,
    TwoFactorSetupModalComponent,
    LoaderComponent,
  ],
})
export class UserCardComponent implements OnInit {
  student!: User;
  profileForm: FormGroup;
  allergies: Allergy[] = [];
  activeTab: 'profile' | 'allergies' | 'config' | 'transactions' = 'profile';
  isSidebarCollapsed = false;
  loading = true;

  avatarSvg: string = AssetsConfig.SVG.USER_AVATAR;
  protected readonly UILabels = UILabels;
  encodeURIComponent = encodeURIComponent;

  // 2FA state
  show2FASecret = false;
  twoFASecret: string = '';
  twoFAQRCode: string = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private allergyService: AllergyService,
    private alertService: AlertService,
    private fb: FormBuilder,
    private sidebarService: SidebarService,
    private twoFactorAuthService: TwoFactorAuthService
  ) {
    this.profileForm = this.fb.group({
      allergies: [[]],
      custom_allergies: [''],
    });
  }

  setActiveTab(tab: 'profile' | 'allergies' | 'config' | 'transactions') {
    this.activeTab = tab;
  }

  goToTopUp() {
    this.router.navigate(['/payment/top-up']);
  }

  goToTransactions() {
    this.router.navigate(['/profile/transactions']);
  }

  toggleSidebar() {
    this.sidebarService.toggle();
  }

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((collapsed) => {
      this.isSidebarCollapsed = collapsed;
    });
    this.loadData();
  }

  loadData() {
    const rawUser = localStorage.getItem(AppConstants.STORAGE_KEYS.USER);
    if (!rawUser) {
      console.error('No user in localStorage.');
      this.loading = false;
      return;
    }

    const parsedUser = JSON.parse(rawUser);
    const userId = parsedUser.id;

    this.loading = true;
    forkJoin({
      allergies: this.allergyService.getAllergies(),
      user: this.userService.getUserById(userId),
    }).subscribe({
      next: (result) => {
        this.allergies = result.allergies;
        this.student = result.user;

        const allergyIds = this.student.allergies
          ? this.student.allergies.map((a) => a.id)
          : [];

        this.profileForm.patchValue({
          allergies: allergyIds,
          custom_allergies: this.student.custom_allergies,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading profile data', err);
        this.loading = false;
      },
    });
  }

  saveAllergies() {
    const formValue = this.profileForm.value;
    const allergiesList = formValue.allergies;
    const customAllergies = formValue.custom_allergies;

    this.allergyService
      .updateUserAllergies(allergiesList, customAllergies)
      .subscribe({
        next: (res) => {
          this.alertService.show(
            'success',
            Messages.USERS.ALLERGIES_SAVED,
            Messages.USERS.ALLERGIES_SAVED_DESC
          );
          this.loadData();
        },
        error: (err) => {
          this.alertService.show(
            'error',
            Messages.GENERIC.ERROR,
            Messages.USERS.ALLERGIES_ERROR
          );
          console.error(err);
        },
      });
  }

  toggleAllergy(allergyId: number) {
    const currentAllergies = this.profileForm.get('allergies')
      ?.value as number[];
    const index = currentAllergies.indexOf(allergyId);

    if (index > -1) {
      currentAllergies.splice(index, 1);
    } else {
      currentAllergies.push(allergyId);
    }

    this.profileForm.get('allergies')?.setValue([...currentAllergies]);
  }

  isAllergySelected(allergyId: number): boolean {
    const currentAllergies = this.profileForm.get('allergies')
      ?.value as number[];
    return currentAllergies.includes(allergyId);
  }

  logout() {
    this.router.navigate(['/logout']);
  }

  forgotPassword() {
    this.router.navigate(['/reset-password']);
  }

  enable2FA() {
    this.twoFactorAuthService.generateSecret().subscribe({
      next: (res) => {
        this.twoFASecret = res.data.secret;
        this.twoFAQRCode = res.data.qr_code_url;
        this.show2FASecret = true;
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.GENERIC.ERROR,
          this.UILabels.PROFILE.TWO_FACTOR_ERROR_GENERATE
        );
      },
    });
  }

  verifyAndEnable2FA() {
    // Logic moved to TwoFactorSetupModalComponent
  }

  on2FASetupComplete() {
    this.show2FASecret = false;
    this.loadData();
  }

  disable2FA() {
    this.twoFactorAuthService.disable2FA().subscribe({
      next: (res) => {
        this.alertService.show(
          'success',
          '2FA ' + this.UILabels.PROFILE.TWO_FACTOR_DISABLED,
          this.UILabels.PROFILE.TWO_FACTOR_SUCCESS_DISABLE
        );
        this.loadData();
      },
      error: (err) => {
        this.alertService.show(
          'error',
          Messages.GENERIC.ERROR,
          this.UILabels.PROFILE.TWO_FACTOR_ERROR_DISABLE
        );
      },
    });
  }
}
