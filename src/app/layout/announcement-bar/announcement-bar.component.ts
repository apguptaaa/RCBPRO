import { Component } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  template: `
    <div class="bg-espresso px-4 py-2.5 text-center text-xs font-medium tracking-wide text-cream sm:text-sm">
      <span>Freshly made to order</span>
      <span class="mx-3 text-sand/40">•</span>
      <span>100% eggless cakes · Delivery only in Gwalior</span>
    </div>
  `
})
export class AnnouncementBarComponent {}
