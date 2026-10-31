import { Component, inject } from '@angular/core';
import { StoreService } from '../../core/services/store.service';
import {
  LucideX,
  LucideChevronRight,
  LucidePhone
} from '@lucide/angular';

interface NavLink {
  label: string;
  href: string;
}

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [LucideX, LucideChevronRight, LucidePhone],
  templateUrl: './mobile-nav.component.html'
})
export class MobileNavComponent {
  readonly store = inject(StoreService);

  readonly navLinks: NavLink[] = [
    { label: 'Home',         href: '#' },
    { label: 'Cakes',        href: '#categories' },
    { label: 'Best Sellers', href: '#shop' },
    { label: 'Occasions',    href: '#occasions' }
  ];

  close(): void {
    this.store.mobileOpen.set(false);
  }

  openCustomize(): void {
    this.close();
    setTimeout(() => this.store.customOpen.set(true), 200);
  }
}
