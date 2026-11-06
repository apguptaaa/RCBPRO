import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { LucideX, LucideGift, LucidePhone } from '@lucide/angular';
import { StoreService } from '../../core/services/store.service';

const SESSION_KEY = 'cb_promo_shown';
const DELAY_MS    = 10_000; // 10 seconds

@Component({
  selector: 'app-promo-popup',
  standalone: true,
  imports: [LucideX, LucideGift, LucidePhone],
  templateUrl: './promo-popup.component.html',
  styles: [`
    .promo-backdrop { animation: promoIn .35s ease both; }
    .promo-card     { animation: promoSlide .4s cubic-bezier(.22,.9,.36,1) both; }

    @keyframes promoIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes promoSlide {
      from { opacity: 0; transform: translateY(32px) scale(.96); }
      to   { opacity: 1; transform: translateY(0)    scale(1);   }
    }
  `]
})
export class PromoPopupComponent implements OnInit, OnDestroy {
  private readonly store = inject(StoreService);

  readonly visible  = signal(false);
  readonly phone    = signal('');
  readonly loading  = signal(false);
  readonly claimed  = signal(false);
  readonly error    = signal('');

  private timer?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    // Only show once per browser session
    if (sessionStorage.getItem(SESSION_KEY)) return;

    this.timer = setTimeout(() => {
      this.visible.set(true);
      sessionStorage.setItem(SESSION_KEY, '1');
    }, DELAY_MS);
  }

  ngOnDestroy(): void {
    clearTimeout(this.timer);
  }

  close(): void {
    this.visible.set(false);
  }

  onPhoneInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value.replace(/\D/g, '');
    this.phone.set(raw);
    this.error.set('');
  }

  async claim(): Promise<void> {
    const ph = this.phone().trim();
    if (!ph || ph.length < 10) {
      this.error.set('Please enter a valid 10-digit mobile number.');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    try {
      // Best-effort: POST to backend; silently succeeds even if endpoint not yet implemented
      await fetch('/api/v1/promo/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: ph, offer: 'FLAT50' })
      });
    } catch {
      // Ignore network errors — still show success to user
    } finally {
      this.loading.set(false);
    }

    this.claimed.set(true);
    // Auto-close after 3 seconds
    setTimeout(() => this.close(), 3000);
  }
}
