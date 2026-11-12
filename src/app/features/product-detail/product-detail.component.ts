import { Component, computed, effect, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  LucideArrowLeft,
  LucideCheck,
  LucideHeart,
  LucideMapPin,
  LucideShoppingBag,
  LucideStar,
  LucideTruck
} from '@lucide/angular';
import { FormatPricePipe } from '../../core/pipes/format-price.pipe';
import { Product } from '../../core/models/product.model';
import { StoreService } from '../../core/services/store.service';
import { DEFAULT_FLAVOURS } from '../../core/data/catalog.data';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [
    RouterLink,
    FormatPricePipe,
    DecimalPipe,
    LucideArrowLeft,
    LucideCheck,
    LucideHeart,
    LucideMapPin,
    LucideShoppingBag,
    LucideStar,
    LucideTruck
  ],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly store = inject(StoreService);
  private readonly routeParams = toSignal(this.route.paramMap, {
    initialValue: this.route.snapshot.paramMap
  });

  readonly product = computed(() => {
    const id = Number(this.routeParams().get('id'));
    return this.store.products().find(item => item.id === id) ?? null;
  });

  readonly similarProducts = computed(() => {
    const product = this.product();
    if (!product) return [];

    const others = this.store.products().filter(item => item.id !== product.id);
    const sameCategory = others.filter(item => item.category === product.category);
    const otherCakes = others.filter(item => item.category !== product.category);
    return [...sameCategory, ...otherCakes].slice(0, 4);
  });

  readonly reviewStars = [1, 2, 3, 4, 5];
  readonly questions = [
    {
      question: 'Is this cake eggless?',
      answer: 'Yes. Our cakes are made without eggs and prepared fresh to order.'
    },
    {
      question: 'Can I add a personal message?',
      answer: 'Yes. Enter your short cake message above and we will include it with your order.'
    },
    {
      question: 'Where is delivery available?',
      answer: 'We currently deliver across Gwalior. Enter your pincode above and we will confirm availability.'
    },
    {
      question: 'How far in advance should I order?',
      answer: 'This cake is made to order. Please place your order ahead of your celebration so we can prepare it fresh.'
    }
  ];

  readonly sizes = [
    { label: '500 g', grams: 500 },
    { label: '1 kg', grams: 1000 },
    { label: '1.5 kg', grams: 1500 },
    { label: '2 kg', grams: 2000 },
    { label: '3 kg', grams: 3000 },
    { label: '4 kg', grams: 4000 }
  ];
  readonly cupcakeCounts = [6, 12, 24];
  readonly selectedSize = signal('500 g');
  readonly selectedCupCount = signal(6);
  readonly selectedFlavour = signal('');
  readonly activeImage = signal(0);
  readonly heartShape = signal(false);
  readonly cakeMessage = signal('');
  readonly pincode = signal('');
  readonly deliveryMessage = signal('');
  readonly imagePositions = ['50% 50%', '50% 28%', '50% 70%', '28% 50%'];

  readonly price = computed(() => {
    const product = this.product();
    if (product?.unit_type === 'count') return Math.round(product.price * this.selectedCupCount() / 6);
    const size = this.sizes.find(item => item.label === this.selectedSize());
    return product && size ? Math.round(product.price * size.grams / 500) : product?.price ?? 0;
  });

  readonly oldPrice = computed(() => {
    const product = this.product();
    if (product?.unit_type === 'count') return Math.round(product.oldPrice * this.selectedCupCount() / 6);
    const size = this.sizes.find(item => item.label === this.selectedSize());
    return product && size ? Math.round(product.oldPrice * size.grams / 500) : product?.oldPrice ?? 0;
  });
  readonly applicableAddons = computed(() => {
    const productId = this.product()?.id;
    return this.store.addons().filter(addon => addon.product_id === null || addon.product_id === productId);
  });
  readonly selectedAddonIds = signal<string[]>([]);
  readonly availableFlavours = computed(() => {
    const flavours = this.product()?.flavours;
    return flavours?.length ? flavours : DEFAULT_FLAVOURS;
  });

  constructor() {
    effect(() => {
      const flavours = this.availableFlavours();
      if (!flavours.includes(this.selectedFlavour())) {
        this.selectedFlavour.set(flavours[0] ?? '');
      }
    });
  }

  readonly totalPrice = computed(() => {
    const addonTotal = this.applicableAddons()
      .filter(addon => this.selectedAddonIds().includes(addon.id))
      .reduce((sum, addon) => sum + Number(addon.price), 0);
    return this.price() + addonTotal;
  });

  navigateToShop(): void {
    void this.router.navigateByUrl('/').then(() => {
      requestAnimationFrame(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }));
    });
  }

  checkDelivery(): void {
    const code = this.pincode().trim();
    if (!/^\d{6}$/.test(code)) {
      this.deliveryMessage.set('Please enter a valid 6-digit pincode.');
      return;
    }
    this.deliveryMessage.set(`We’ll confirm delivery availability for ${code} at checkout.`);
  }

  updateCakeMessage(event: Event): void {
    this.cakeMessage.set((event.target as HTMLInputElement).value);
  }

  updatePincode(event: Event): void {
    this.pincode.set((event.target as HTMLInputElement).value);
    this.deliveryMessage.set('');
  }

  updateHeartShape(event: Event): void {
    this.heartShape.set((event.target as HTMLInputElement).checked);
  }

  toggleAddon(id: string, checked: boolean): void {
    this.selectedAddonIds.update(current =>
      checked ? [...new Set([...current, id])] : current.filter(selected => selected !== id)
    );
  }

  updateAddonSelection(id: string, event: Event): void {
    this.toggleAddon(id, (event.target as HTMLInputElement).checked);
  }

  toggleWishlist(product: Product): void {
    this.store.toggleWishlist(product.id);
  }

  addToBag(product: Product): void {
    const size = this.selectedSize();
    const selectedAddons = this.applicableAddons()
      .filter(addon => this.selectedAddonIds().includes(addon.id))
      .map(addon => addon.name);
    const variant = [
      this.selectedFlavour() ? `Flavour: ${this.selectedFlavour()}` : '',
      product.unit_type === 'count' ? `Quantity: ${this.selectedCupCount()} cupcakes` : `Weight: ${size}`,
      this.heartShape() ? 'Heart shape' : '',
      selectedAddons.length ? `Add-ons: ${selectedAddons.join(', ')}` : ''
    ].filter(Boolean).join(' · ');
    const selectedProduct = { ...product, price: this.totalPrice(), oldPrice: this.oldPrice() };
    this.store.addToCart(selectedProduct, {
      variant,
      message: this.cakeMessage().trim() || undefined
    });
  }
}
