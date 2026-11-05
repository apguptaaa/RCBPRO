import { Injectable } from '@angular/core';

const API_BASE = '/api/v1';
const TOKEN_KEY = 'crumb-bloom-access-token';

interface ApiErrorBody {
  error?: string;
  message?: string;
  details?: { field: string; message: string }[];
}

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, 'POST', body);
  }

  put<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, 'PUT', body);
  }

  patch<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>(path, 'PATCH', body);
  }

  delete(path: string): Promise<void> {
    return this.request<void>(path, 'DELETE');
  }

  private async request<T>(path: string, method = 'GET', body?: unknown): Promise<T> {
    const token = this.getToken();
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      ...(body === undefined ? {} : { body: JSON.stringify(body) })
    });
    const responseText = response.status === 204 ? '' : await response.text();
    let responseBody: ApiErrorBody | null = null;
    if (responseText) {
      try {
        responseBody = JSON.parse(responseText) as ApiErrorBody;
      } catch {
        throw new Error(`The API returned an invalid response (HTTP ${response.status}).`);
      }
    }

    if (!response.ok) {
      const details = responseBody?.details?.map((item) => `${item.field}: ${item.message}`).join(' ');
      throw new Error(details || responseBody?.error || responseBody?.message || `Request failed (HTTP ${response.status}).`);
    }
    return responseBody as T;
  }
}
