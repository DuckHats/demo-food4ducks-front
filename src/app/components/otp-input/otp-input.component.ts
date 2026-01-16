import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, QueryList, ViewChildren } from '@angular/core';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp-input.component.html',
  styleUrls: ['./otp-input.component.css']
})
export class OtpInputComponent implements AfterViewInit {
  @Input() length = 6;
  @Output() codeChange = new EventEmitter<string>();
  otpInputs: string[] = [];
  @ViewChildren('otpInput') otpInputElements!: QueryList<ElementRef>;
  otpArray: number[] = [];

  ngOnInit() {
    this.otpArray = Array(this.length).fill(0);
  }

  ngAfterViewInit() {
    setTimeout(() => this.otpInputElements.first?.nativeElement.focus(), 0);
  }

  onInput(event: any, index: number) {
    const input = event.target.value;
    if (/^\d$/.test(input) && index < this.length - 1) {
      this.otpInputElements.toArray()[index + 1].nativeElement.focus();
    } else if (input.length > 1) {
      event.target.value = input.charAt(0);
    }
    this.emitCode();
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const inputs = this.otpInputElements.toArray();
    if ((event.key === 'Backspace' || event.key === 'Delete') && index > 0 && !inputs[index].nativeElement.value) {
      inputs[index - 1].nativeElement.focus();
      inputs[index - 1].nativeElement.value = '';
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const text = event.clipboardData?.getData('text')?.trim();
    if (text && /^\d+$/.test(text)) {
      const digits = text.slice(0, this.length).split('');
      const inputs = this.otpInputElements.toArray();
      digits.forEach((digit, i) => {
        if (inputs[i]) {
          inputs[i].nativeElement.value = digit;
        }
      });
      this.emitCode();
    }
  }

  emitCode() {
    const code = this.otpInputElements.toArray().map(input => input.nativeElement.value).join('');
    this.codeChange.emit(code);
  }
}

