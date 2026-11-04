import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import {
  LucideX,
  LucideChevronRight,
  LucidePhone
} from '@lucide/angular';

interface NavLink {
  label: string;
  path: string;
}

@Component({
  selector: 'app-mobile-nav',
  standalone: true,
  imports: [LucideX, LucideChevronRight, LucidePhone, RouterLink],
  templateUrl: './mobile-nav.component.html'
})
export class MobileNavComponent {
  readonly store = inject(StoreService);

  readonly navLinks: NavLink[] = [
    { label: 'Home',         path: '/' },
    { label: 'Cakes',        path: '/cakes' },
    { label: 'Best Sellers', path: '/best-sellers' },
    { label: 'Occasions',    path: '/occasions' },
    { label: 'Customize',   path: '/customize' }
  ];

  close(): void {
    this.store.mobileOpen.set(false);
  }
}
