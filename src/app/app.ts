import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnouncementBarComponent } from './layout/announcement-bar/announcement-bar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MobileNavComponent } from './overlays/mobile-nav/mobile-nav.component';
import { CartComponent } from './overlays/cart/cart.component';
import { QuickViewComponent } from './overlays/quick-view/quick-view.component';
import { CustomOrderModalComponent } from './overlays/custom-order-modal/custom-order-modal.component';
import { ToastComponent } from './shared/toast/toast.component';
import { LoaderComponent } from './shared/loader/loader.component';
import { PromoPopupComponent } from './shared/promo-popup/promo-popup.component';
import { HealthService } from './core/services/health.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    // Layout chrome (persistent across all routes)
    AnnouncementBarComponent,
    HeaderComponent,
    FooterComponent,
    // Overlays (persistent across all routes)
    MobileNavComponent,
    CartComponent,
    QuickViewComponent,
    CustomOrderModalComponent,
    ToastComponent,
    // Startup loader
    LoaderComponent,
    // Promo popup (shown after 10 s)
    PromoPopupComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly health = inject(HealthService);

  /** True while the health check is in flight */
  readonly loading = signal(true);

  ngOnInit(): void {
    this.health.check().subscribe({
      next:  () => this.loading.set(false),
      error: () => this.loading.set(false) // show app even if health fails
    });
  }
}
