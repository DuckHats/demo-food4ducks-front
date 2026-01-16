import { Component, Input, Output, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-action-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./action-button.component.html",
  styleUrls: ["./action-button.component.css"],
})
export class ActionButtonComponent {
  @Input() label: string = "";
  @Output() onClick = new EventEmitter<void>();

  arrowIcon: string = `<svg id="109:142" layer-name="Frame" width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[20px] h-[20px]">
    <path d="M4.72217 10H16.3888" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
    <path d="M10.5557 4.16675L16.389 10.0001L10.5557 15.8334" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  </svg>`;
}
