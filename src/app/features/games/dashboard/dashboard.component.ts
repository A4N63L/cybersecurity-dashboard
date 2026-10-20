import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';
@Component({standalone:true,imports:[RouterLink],template:`
  <section class="page-heading"><div><p class="eyebrow">TU UNIVERSO GAMER</p><h1>Mi biblioteca<span class="accent">.</span></h1><p>Todos tus mundos favoritos, en un solo lugar.</p></div><a class="button" routerLink="/games/new">＋ Agregar videojuego</a></section>
  <section class="stats" aria-label="Resumen"><div><small>EN TU COLECCIÓN</small><strong>{{games().length}} <span>juegos</span></strong></div><div><small>GÉNEROS POR EXPLORAR</small><strong>{{genres()}} <span>universos</span></strong></div><div><small>ESTADO DE SESIÓN</small><strong class="session">● Conectado</strong><span class="small">Keycloak + OpenLDAP</span></div></section>
  <div class="section-toolbar"><h2>Tu colección</h2><label class="search"><span>⌕</span><input aria-label="Buscar videojuegos" placeholder="Buscar un videojuego…" (input)="query.set($any($event.target).value)"></label></div>
  @if (loading()) { <p class="notice" role="status">Cargando tu colección…</p> }
  @if (error()) { <div role="alert" class="error">{{error()}} <button class="ghost" (click)="load()">Reintentar</button></div> }
  <section class="game-grid">
    @for (game of filtered(); track game.id; let i = $index) {
      <article class="game-card"><div class="game-art" [class]="'game-art art-' + (i % 4)"><span class="game-number">{{game.release_year}}</span><span class="art-symbol" aria-hidden="true">{{['✧','◈','☽','✦'][i % 4]}}</span><span class="genre-tag">{{game.genre}}</span></div><div class="game-info"><h3>{{game.title}}</h3><p>{{game.platform}}</p><div class="game-bottom"><span>EN LA BIBLIOTECA</span><span>#{{game.id.toString().padStart(3,'0')}}</span></div></div></article>
    } @empty { @if(!loading() && !error()) {<div class="empty"><h3>{{query() ? 'Sin coincidencias' : 'Tu colección empieza aquí'}}</h3><p>{{query() ? 'Prueba con otro título, género o plataforma.' : 'Agrega tu primer videojuego.'}}</p><a routerLink="/games/new">Agregar videojuego →</a></div>} }
  </section>
`})
export class DashboardComponent implements OnInit {
  private service = inject(GameService);
  games = signal<Game[]>([]); query = signal(''); loading = signal(true); error = signal('');
  genres = computed(() => new Set(this.games().map(g => g.genre)).size);
  filtered = computed(() => this.games().filter(g => `${g.title} ${g.genre} ${g.platform}`.toLowerCase().includes(this.query().toLowerCase())));
  ngOnInit() { this.load(); }
  load() { this.loading.set(true); this.error.set(''); this.service.list().subscribe({next: games => {this.games.set(games);this.loading.set(false);},error: () => {this.error.set('No se pudo cargar la colección. Comprueba el backend y tu sesión.');this.loading.set(false);}}); }
}
