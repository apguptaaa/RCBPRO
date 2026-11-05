import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiClientService } from './api-client.service';

type UserRole = 'customer' | 'admin' | 'super_admin';

interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string; role: UserRole };
}

@Injectable({ providedIn: 'root' })
export class AdminAuthService {
  private readonly router = inject(Router);
  private readonly api = inject(ApiClientService);
  private readonly sessionReady: Promise<void>;
  readonly user = signal<{ email: string; name?: string } | null>(null);
  readonly role = signal<UserRole | null>(null);
  readonly ready = signal(false);

  constructor() {
    this.sessionReady = this.restoreSession();
  }

  async signIn(email: string, password: string): Promise<string | null> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/login', { email, password });
      this.api.setToken(response.token);
      this.setUser(response.user);
      const destination = response.user.role === 'admin' || response.user.role === 'super_admin' ? '/admin' : '/';
      if (!await this.router.navigateByUrl(destination)) {
        return 'Login succeeded, but the page could not be opened. Please try again.';
      }
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'Login failed. Please try again.';
    }
  }

  async signUp(name: string, email: string, password: string): Promise<string | null> {
    try {
      const response = await this.api.post<AuthResponse>('/auth/register', { name, email, password });
      this.api.setToken(response.token);
      this.setUser(response.user);
      if (!await this.router.navigateByUrl('/')) {
        return 'Account created, but the page could not be opened. Please try again.';
      }
      return null;
    } catch (error) {
      return error instanceof Error ? error.message : 'Account creation failed. Please try again.';
    }
  }

  async signOut(): Promise<void> {
    this.api.clearToken();
    this.user.set(null);
    this.role.set(null);
    await this.router.navigateByUrl('/login');
  }

  async hasAdminAccess(): Promise<boolean> {
    await this.sessionReady;
    return this.role() === 'admin' || this.role() === 'super_admin';
  }

  private async restoreSession(): Promise<void> {
    try {
      const token = this.api.getToken();
      if (token) {
        const response = await this.api.get<{ user: AuthResponse['user'] }>('/auth/me');
        this.setUser(response.user);
      }
    } catch (error) {
      this.api.clearToken();
      if (!(error instanceof Error) || error.message !== 'Authentication required.') {
        console.error('Could not restore the signed-in user:', error);
      }
    } finally {
      this.ready.set(true);
    }
  }

  private setUser(user: AuthResponse['user']): void {
    this.user.set({ email: user.email, name: user.name });
    this.role.set(user.role);
  }
}
