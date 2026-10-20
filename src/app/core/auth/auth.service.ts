import { Injectable, signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly keycloak = new Keycloak({url: environment.keycloakUrl, realm: environment.realm, clientId: environment.clientId});
  readonly authenticated = signal(false);
  readonly username = signal('');
  readonly error = signal('');
  private initialization?: Promise<void>;
  init(): Promise<void> { return this.initialization ??= this.initialize(); }
  private async initialize(): Promise<void> {
    try {
      // El adaptador procesa state/nonce, código, verificador PKCE y callback.
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso', pkceMethod: 'S256', checkLoginIframe: false,
        responseMode: 'query', redirectUri: location.origin + '/auth/callback'
      });
      this.authenticated.set(authenticated);
      this.username.set(this.keycloak.tokenParsed?.['preferred_username'] ?? '');
      this.keycloak.onAuthLogout = () => this.authenticated.set(false);
      this.keycloak.onAuthRefreshError = () => this.authenticated.set(false);
    } catch {
      this.error.set('No se pudo conectar con Keycloak. Comprueba que el laboratorio esté disponible.');
    }
  }
  async login(): Promise<void> {
    if (this.error()) { location.reload(); return; }
    await this.keycloak.login({redirectUri: location.origin + '/auth/callback'});
  }
  async logout(): Promise<void> {
    await this.keycloak.logout({redirectUri: location.origin + '/login'});
  }
  async accessToken(): Promise<string> {
    if (!this.authenticated()) throw new Error('Sesión requerida');
    try { await this.keycloak.updateToken(30); }
    catch { this.authenticated.set(false); throw new Error('La sesión ha caducado. Vuelve a iniciar sesión.'); }
    if (!this.keycloak.token) throw new Error('Token no disponible');
    return this.keycloak.token;
  }
}
