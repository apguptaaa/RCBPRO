import { Component } from '@angular/core';
import {
  LucideCakeSlice,
  LucidePhone,
  LucideMail,
  LucideClock3
} from '@lucide/angular';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    LucideCakeSlice,
    LucidePhone,
    LucideMail,
    LucideClock3,
    RouterLink
  ],
  templateUrl: './footer.component.html'
})
export class FooterComponent {}
