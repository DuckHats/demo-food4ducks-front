import { Component } from '@angular/core';
import { UILabels } from '../../config/ui-labels.config';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();
  protected readonly UILabels = UILabels;
}
