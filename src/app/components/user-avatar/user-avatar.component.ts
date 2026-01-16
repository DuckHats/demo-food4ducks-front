import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: "app-user-avatar",
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: "./user-avatar.component.html",
  styleUrls: ["./user-avatar.component.css"],
})
export class UserAvatarComponent {
  @Input() username: string = "";

}
