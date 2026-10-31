import { Component } from '@angular/core';
import { AnnouncementBarComponent } from './layout/announcement-bar/announcement-bar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MobileNavComponent } from './overlays/mobile-nav/mobile-nav.component';
import { CartComponent } from './overlays/cart/cart.component';
import { QuickViewComponent } from './overlays/quick-view/quick-view.component';
import { CustomOrderModalComponent } from './overlays/custom-order-modal/custom-order-modal.component';
import { ToastComponent } from './shared/toast/toast.component';
import { HeroComponent } from './features/hero/hero.component';
import { MarqueeComponent } from './features/marquee/marquee.component';
import { CategoriesComponent } from './features/categories/categories.component';
import { PromoBannerComponent } from './features/promo-banner/promo-banner.component';
import { ShopComponent } from './features/shop/shop.component';
import { CustomOrderBannerComponent } from './features/custom-order/custom-order-banner.component';
import { OccasionsComponent } from './features/occasions/occasions.component';
import { ReviewsComponent } from './features/reviews/reviews.component';
import { NewsletterComponent } from './features/newsletter/newsletter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    // Layout
    AnnouncementBarComponent,
    HeaderComponent,
    FooterComponent,
    // Overlays
    MobileNavComponent,
    CartComponent,
    QuickViewComponent,
    CustomOrderModalComponent,
    ToastComponent,
    // Page sections
    HeroComponent,
    MarqueeComponent,
    CategoriesComponent,
    PromoBannerComponent,
    ShopComponent,
    CustomOrderBannerComponent,
    OccasionsComponent,
    ReviewsComponent,
    NewsletterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
