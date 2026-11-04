import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideArrowLeft, LucideCakeSlice, LucideGift, LucideHeart, LucideTruck } from '@lucide/angular';
import { AdminAuthService } from '../../core/services/admin-auth.service';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule, RouterLink, LucideArrowLeft, LucideCakeSlice, LucideGift, LucideHeart, LucideTruck],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  private readonly auth = inject(AdminAuthService);
  private readonly store = inject(StoreService);
  readonly mode = signal<'login' | 'signup'>('login');
  readonly feedback = signal('');
  identity = '';
  customerName = '';
  password = '';

  async submit(): Promise<void> {
    this.feedback.set('');
    if (this.mode() === 'signup') {
      this.feedback.set('Customer sign-up is a demo only and is not connected to a backend yet.');
      return;
    }

    const error = await this.auth.signIn(this.identity, this.password);
    if (error) {
      this.feedback.set(error);
      this.store.toast.set(error);
      return;
    }
    this.store.toast.set(this.auth.role() === 'super_admin'
      ? 'Admin login successful.'
      : 'Customer demo login successful.');
  }
}
