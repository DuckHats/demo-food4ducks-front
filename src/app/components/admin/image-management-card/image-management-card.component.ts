import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UILabels } from '../../../config/ui-labels.config';

@Component({
  selector: 'app-image-management-card',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './image-management-card.component.html',
})
export class ImageManagementCardComponent {
  @Input() image: any;
  @Output() update = new EventEmitter<any>();
  @Output() delete = new EventEmitter<number>();

  UILabels = UILabels;

  onUpdate() {
    this.update.emit(this.image);
  }

  onDelete() {
    this.delete.emit(this.image.id);
  }
}
