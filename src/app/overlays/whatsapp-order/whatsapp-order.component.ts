import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { LucideMessageCircle, LucideX } from '@lucide/angular';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-whatsapp-order',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, LucideMessageCircle, LucideX],
  templateUrl: './whatsapp-order.component.html'
})
export class WhatsAppOrderComponent {
  readonly store = inject(StoreService);
  readonly products = this.store.products;
  readonly weights = ['500 g', '1 kg', '1.5 kg', '2 kg', '3 kg', '4 kg'];
  readonly designs = ['As shown in the photo', 'Heart shape', 'Custom design'];

  customerName = '';
  productId = '';
  weight = '500 g';
  design = this.designs[0];
  designDetails = '';
  cakeMessage = '';
  pincode = '';
  deliveryDate = '';
  query = '';

  selectedProduct() {
    return this.products().find(product => product.id === Number(this.productId)) ?? null;
  }

  close(): void {
    this.store.whatsappOpen.set(false);
  }

  openWhatsApp(): void {
    const product = this.selectedProduct();
    const details = [
      `Name: ${this.customerName.trim()}`,
      `Cake: ${product?.name ?? 'Please help me choose a cake'}`,
      `Weight: ${this.weight}`,
      `Design: ${this.design}`,
      this.designDetails.trim() ? `Design details: ${this.designDetails.trim()}` : '',
      this.cakeMessage.trim() ? `Message on cake: ${this.cakeMessage.trim()}` : '',
      this.pincode.trim() ? `Delivery pincode: ${this.pincode.trim()}` : '',
      this.deliveryDate ? `Needed on: ${this.deliveryDate}` : '',
      this.query.trim() ? `Query: ${this.query.trim()}` : ''
    ].filter(Boolean);

    const message = [
      'Hello! I have a cake enquiry/order:',
      '',
      ...details,
      '',
      'Please confirm availability, final price and delivery details.'
    ].join('\n');

    const url = `https://wa.me/919131138005?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    this.close();
  }
}
