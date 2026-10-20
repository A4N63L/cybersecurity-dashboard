import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
@Component({selector:'app-root',standalone:true,imports:[RouterOutlet,RouterLink,RouterLinkActive],template:`
  <header class="topbar"><a class="brand" routerLink="/dashboard"><span class="brand-icon">G</span> GameVault<span class="lab-label">LAB</span></a>
    @if (auth.authenticated()) {
      <nav aria-label="Principal"><a routerLink="/dashboard" routerLinkActive="active">Mi biblioteca</a><a routerLink="/games/new" routerLinkActive="active">Agregar juego</a></nav>
      <div class="user"><span class="avatar">{{auth.username().slice(0,1).toUpperCase()}}</span><span>{{auth.username()}}</span><button class="ghost" (click)="auth.logout()">Salir</button></div>
    } @else { <span class="header-note">Ciberseguridad · Práctica 01</span> }
  </header><main><router-outlet /></main>
  <footer>GameVault · Angular + FastAPI <span>Identidad proporcionada por Keycloak + OpenLDAP</span></footer>
`})
export class AppComponent { readonly auth = inject(AuthService); }
