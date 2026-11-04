import { Component } from '@angular/core';
import { OccasionsComponent } from './occasions.component';

@Component({
  selector: 'app-occasions-page',
  imports: [OccasionsComponent],
  template: `
    <main class="pt-12 sm:pt-16">
      <app-occasions />
    </main>
  `
})
export class OccasionsPageComponent {}
