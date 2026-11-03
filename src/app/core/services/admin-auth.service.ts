import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

const DEMO_EMAIL = 'admin@crumbandbloom.com';
const DEMO_PASSWORD = 'admin123';
const DEMO_CUSTOMER_EMAIL = 'customer@crumbandbloom.com';
const DEMO_CUSTOMER_PASSWORD = 'user123';
const SESSION_KEY = 'crumb-bloom-demo-admin';

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly router = inject(Router);
  private readonly restoredSession = this.restoreSession();
  readonly user = signal<{ email: string } | null>(this.restoredSession?.user ?? null);
  readonly role = signal<'customer' | 'admin' | 'super_admin' | null>(this.restoredSession?.role ?? null);
  readonly ready = signal(true);

  async signIn(email: string, password: string): Promise<string | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const role = normalizedEmail === DEMO_EMAIL && password === DEMO_PASSWORD
      ? 'super_admin'
      : normalizedEmail === DEMO_CUSTOMER_EMAIL && password === DEMO_CUSTOMER_PASSWORD
        ? 'customer'
        : null;
    if (!role) {
      return 'Demo login details are incorrect. Use one of the demo accounts shown below.';
    }

    const user = { email: normalizedEmail };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user, role }));
    this.user.set(user);
    this.role.set(role);
    await this.router.navigateByUrl(role === 'super_admin' ? '/admin' : '/');
    return null;
  }

  async signOut(): Promise<void> {
    sessionStorage.removeItem(SESSION_KEY);
    this.user.set(null);
    this.role.set(null);
    await this.router.navigateByUrl('/admin/login');
  }

  async hasAdminAccess(): Promise<boolean> {
    return this.role() === 'admin' || this.role() === 'super_admin';
  }

  private restoreSession(): { user: { email: string }; role: 'customer' | 'super_admin' } | null {
    const savedUser = sessionStorage.getItem(SESSION_KEY);
    if (!savedUser) return null;

    try {
      const session = JSON.parse(savedUser) as { user?: { email?: unknown }; role?: unknown };
      if (session.role === 'super_admin' && session.user?.email === DEMO_EMAIL) {
        return { user: { email: DEMO_EMAIL }, role: 'super_admin' };
      }
      if (session.role === 'customer' && session.user?.email === DEMO_CUSTOMER_EMAIL) {
        return { user: { email: DEMO_CUSTOMER_EMAIL }, role: 'customer' };
      }
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    } catch {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
  }
}
