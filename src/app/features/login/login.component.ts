import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
@Component({standalone:true,imports:[RouterLink],template:`
  <section class="login-layout"><div class="login-story"><p class="eyebrow">TU PRÓXIMA AVENTURA EMPIEZA AQUÍ</p>
    <h1>Grandes juegos.<br><span>Una sola colección.</span></h1>
    <p class="lead">Organiza tus favoritos, descubre tu biblioteca y añade la próxima historia que quieres jugar.</p>
    <div class="orb" aria-hidden="true"><span>✦</span><small>PLAY · COLLECT · EXPLORE</small></div>
    <div class="chips"><span>Angular</span><span>FastAPI</span><span>SQLite</span></div>
  </div><div class="login-card"><span class="secure-badge">● IDENTIDAD FEDERADA</span><h2>Bienvenido a GameVault</h2>
    <p>Accede con tu cuenta del laboratorio. Keycloak verifica tu identidad con el directorio OpenLDAP.</p>
    @if(auth.error()) { <p role="alert" class="error">{{auth.error()}}</p> }
    @if(auth.authenticated()) { <a class="button full" routerLink="/dashboard">Ir a mi biblioteca →</a> }
    @else { <button class="button full" (click)="auth.login()">Entrar con Keycloak →</button> }
    <div class="auth-flow"><span>01 · Keycloak</span><span>02 · LDAP</span><span>03 · JWT</span></div>
    <p class="fineprint">Authorization Code + PKCE S256<br>Las credenciales se introducen únicamente en Keycloak.</p>
  </div></section>
`})
export class LoginComponent {readonly auth = inject(AuthService);}
