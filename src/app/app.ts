import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnnouncementBarComponent } from './layout/announcement-bar/announcement-bar.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { MobileNavComponent } from './overlays/mobile-nav/mobile-nav.component';
import { CartComponent } from './overlays/cart/cart.component';
import { QuickViewComponent } from './overlays/quick-view/quick-view.component';
import { CustomOrderModalComponent } from './overlays/custom-order-modal/custom-order-modal.component';
import { WhatsAppOrderComponent } from './overlays/whatsapp-order/whatsapp-order.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ScrollToTopComponent } from './shared/scroll-to-top/scroll-to-top.component';

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
    WhatsAppOrderComponent,
    ToastComponent,
    ScrollToTopComponent,
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
