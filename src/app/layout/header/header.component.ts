import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { StoreService } from '../../core/services/store.service';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import {
  LucideMenu,
  LucideCakeSlice,
  LucideMapPin,
  LucideUserRound,
  LucideHeart,
  LucideShoppingBag
} from '@lucide/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    LucideMenu,
    LucideCakeSlice,
    LucideMapPin,
    LucideUserRound,
    LucideHeart,
    LucideShoppingBag,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  readonly store = inject(StoreService);
  readonly adminAuth = inject(AdminAuthService);
  readonly accountMenuOpen = signal(false);
  private readonly router = inject(Router);

  @HostListener('document:click')
  closeAccountMenu(): void {
    this.accountMenuOpen.set(false);
  }

  toggleAccountMenu(event: Event): void {
    event.stopPropagation();
    this.accountMenuOpen.update(open => !open);
  }

  openLogin(): void {
    this.accountMenuOpen.set(false);
    void this.router.navigateByUrl('/login');
  }

  navigateToSection(section: string): void {
    void this.router.navigateByUrl('/').then(() => {
      requestAnimationFrame(() => {
        if (section) {
          document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    });
  }

  navigateToFavorites(): void {
    void this.router.navigateByUrl('/favorites');
  }
}
