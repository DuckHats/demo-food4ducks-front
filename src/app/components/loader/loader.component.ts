import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="flex items-center justify-center p-8 w-full h-full min-h-[200px]"
    >
      <div class="loader-container relative w-16 h-16">
        <!-- Outer Ring -->
        <div
          class="absolute inset-0 border-4 border-slate-100 rounded-full"
        ></div>
        <!-- Inner Spinning Ring -->
        <div
          class="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"
        ></div>
        <!-- Inner Dot -->
        <div
          class="absolute inset-[22px] bg-primary/20 rounded-full animate-pulse"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .border-primary {
        border-color: var(--color-primary);
      }
      .border-t-transparent {
        border-top-color: transparent;
      }
      .bg-primary\\/20 {
        background-color: color-mix(
          in srgb,
          var(--color-primary) 20%,
          transparent
        );
      }
    `,
  ],
})
export class LoaderComponent {}
