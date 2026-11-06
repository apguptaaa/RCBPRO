import { Component } from '@angular/core';

@Component({
  selector: 'app-announcement-bar',
  standalone: true,
  template: `
    <div class="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 bg-espresso px-3 py-2.5 text-center text-[10px] font-medium tracking-wide text-cream sm:gap-x-3 sm:px-4 sm:text-sm">
      <span>Freshly made to order</span>
      <span class="hidden text-sand/40 sm:inline">•</span>
      <span>100% eggless cakes · Delivery only in Gwalior</span>
    </div>
  `
})
export class AnnouncementBarComponent {}
