import { Component } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  template: `
    <div class="bg-espresso px-4 py-2.5 text-center text-xs font-medium tracking-wide text-cream sm:text-sm">
      <span>Freshly baked every day</span>
      <span class="mx-3 text-sand/40">•</span>
      <span>Complimentary delivery on orders above ₹999</span>
    </div>
  `
})
export class AnnouncementBarComponent {}
