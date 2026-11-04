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

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAccountMenu();
  }

  toggleAccountMenu(event: Event): void {
    event.stopPropagation();
    this.accountMenuOpen.update(open => !open);
  }

  signOut(): void {
    this.closeAccountMenu();
    void this.adminAuth.signOut();
  }

  openLogin(): void {
    this.accountMenuOpen.set(false);
    void this.router.navigateByUrl('/login');
  }

  navigateToFavorites(): void {
    void this.router.navigateByUrl('/favorites');
  }
}
