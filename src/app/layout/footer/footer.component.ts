import { Component } from '@angular/core';
import {
  LucideCakeSlice,
  LucidePhone,
  LucideMail,
  LucideClock3
} from '@lucide/angular';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    LucideCakeSlice,
    LucidePhone,
    LucideMail,
    LucideClock3
  ],
  templateUrl: './footer.component.html'
})
export class FooterComponent {}
