import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { LucideMessageCircle, LucideX } from '@lucide/angular';
import { StoreService } from '../../core/services/store.service';
import { AccountDataService } from '../../core/services/account-data.service';

@Component({
  selector: 'app-whatsapp-order',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, LucideMessageCircle, LucideX],
  templateUrl: './whatsapp-order.component.html'
})
export class WhatsAppOrderComponent {
  readonly store = inject(StoreService);
  private readonly accountData = inject(AccountDataService);
  readonly submitting = signal(false);
  readonly submitError = signal('');
  readonly products = this.store.products;
  readonly weights = ['500 g', '1 kg', '1.5 kg', '2 kg', '3 kg', '4 kg'];
  readonly cupcakeCounts = [6, 12, 24];
  readonly designs = ['As shown in the photo', 'Heart shape', 'Custom design'];

  customerName = '';
  productId = '';
  weight = '500 g';
  cupcakeCount = 6;
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

  async openWhatsApp(): Promise<void> {
    if (this.submitting()) return;
    const product = this.selectedProduct();
    const size = product?.unit_type === 'count' ? `${this.cupcakeCount} cupcakes` : this.weight;
    const sizeLabel = product?.unit_type === 'count' ? 'Cupcake count' : 'Weight';
    const details = [
      `Name: ${this.customerName.trim()}`,
      `Cake: ${product?.name ?? 'Please help me choose a cake'}`,
      `${sizeLabel}: ${size}`,
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

    const checkoutWindow = window.open('about:blank', '_blank');
    if (!checkoutWindow) {
      this.submitError.set('Allow pop-ups to continue to WhatsApp.');
      return;
    }
    checkoutWindow.opener = null;
    this.submitting.set(true);
    this.submitError.set('');
    try {
      await this.accountData.createOrderInquiry({
        kind: 'enquiry',
        customer_name: this.customerName.trim(),
        details: {
          product_id: product?.id ?? null,
          weight: size,
          design: this.design,
          design_details: this.designDetails.trim() || undefined,
          cake_message: this.cakeMessage.trim() || undefined,
          pincode: this.pincode.trim(),
          needed_on: this.deliveryDate,
          query: this.query.trim() || undefined
        }
      });
      checkoutWindow.location.href = `https://wa.me/919131138005?text=${encodeURIComponent(message)}`;
      this.close();
    } catch (error) {
      checkoutWindow.close();
      this.submitError.set(error instanceof Error ? error.message : 'Your enquiry could not be saved.');
    } finally {
      this.submitting.set(false);
    }
  }
}
