import { Component } from '@angular/core';
import { HeroComponent } from '../hero/hero.component';
import { MarqueeComponent } from '../marquee/marquee.component';
import { CategoriesComponent } from '../categories/categories.component';
import { PromoBannerComponent } from '../promo-banner/promo-banner.component';
import { ShopComponent } from '../shop/shop.component';
import { CustomOrderBannerComponent } from '../custom-order/custom-order-banner.component';
import { OccasionsComponent } from '../occasions/occasions.component';
import { ReviewsComponent } from '../reviews/reviews.component';
import { NewsletterComponent } from '../newsletter/newsletter.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
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
  template: `
    <main>
      <app-hero />
      <app-categories />
      <app-marquee />
      <app-promo-banner />
      <app-shop />
      <app-custom-order-banner />
      <app-occasions />
      <app-reviews />
      <app-newsletter />
    </main>
  `
})
export class HomePageComponent {}
