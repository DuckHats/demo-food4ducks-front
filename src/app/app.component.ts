import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { BrandingConfig } from './config/branding.config';
import { Inject } from '@angular/core';

import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { AlertContainerComponent } from './components/alert-container/alert-container.component';
import { FooterComponent } from './components/footer/footer.component';
import { NavigationConfig } from './config/navigation.config';

@Component({
  selector: 'app-root',
  imports: [
    NavigationBarComponent,
    RouterOutlet,
    AlertContainerComponent,
    CommonModule,
    FooterComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  showNav = true;
  title = 'testMenu1';

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.router.events.subscribe(() => {
      const url = this.router.url.split('?')[0];

      this.showNav = !(
        url === '/' + NavigationConfig.LOGIN ||
        url === '/' + NavigationConfig.FORGOT_PASSWORD ||
        url === '/' + NavigationConfig.REGISTER ||
        url === '/' + NavigationConfig.RESET_PASSWORD
      );
    });

    this.setTheme();
  }

  private setTheme() {
    const root = this.document.documentElement;
    const colors = BrandingConfig.COLORS;

    root.style.setProperty('--color-primary', colors.PRIMARY);
    root.style.setProperty('--color-primary-dark', colors.PRIMARY_DARK);
    root.style.setProperty('--color-primary-light', colors.PRIMARY_LIGHT);
    root.style.setProperty('--color-secondary', colors.SECONDARY);
    root.style.setProperty('--color-background', colors.BACKGROUND);
  }
}
