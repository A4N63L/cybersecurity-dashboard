import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { GameService } from '../services/game.service';
@Component({standalone:true,imports:[ReactiveFormsModule,RouterLink],template:`
  <a class="back-link" routerLink="/dashboard">← Volver a mi biblioteca</a>
  <section class="page-heading"><div><p class="eyebrow">UNA NUEVA HISTORIA</p><h1>Amplía tu colección<span class="accent">.</span></h1><p>Registra un videojuego y dale un lugar en tu biblioteca.</p></div></section>
  <div class="form-layout"><form class="panel game-form" [formGroup]="form" (ngSubmit)="submit()"><h2>Datos del videojuego</h2>
    <label for="title">Título</label><input id="title" formControlName="title" maxlength="150" placeholder="Ej. Hollow Knight" autocomplete="off">
    <div class="form-row"><div><label for="genre">Género</label><input id="genre" formControlName="genre" maxlength="80" placeholder="Ej. Metroidvania"></div><div><label for="platform">Plataforma</label><input id="platform" formControlName="platform" maxlength="80" placeholder="Ej. PC / Nintendo Switch"></div></div>
    <label for="release_year">Año de lanzamiento</label><input id="release_year" type="number" min="1950" max="2100" formControlName="release_year">
    @if(form.invalid && attempted()) {<p class="error" role="alert">Completa todos los campos. El año debe estar entre 1950 y 2100.</p>}
    @if(error()) {<p class="error" role="alert">{{error()}}</p>}
    <div class="form-actions"><a class="ghost" routerLink="/dashboard">Cancelar</a><button class="button" type="submit" [disabled]="saving()">{{saving() ? 'Guardando…' : 'Guardar videojuego →'}}</button></div>
  </form><aside class="panel form-aside"><span class="aside-icon">✦</span><h2>Tu próximo favorito</h2><p>Los juegos quedan guardados en SQLite, incluso después de reiniciar los contenedores.</p><hr><p class="fineprint">DEMO LOCAL</p><p class="small">La solicitud utiliza tu JWT mediante el interceptor. Puedes inspeccionarlo en la consola del navegador.</p></aside></div>
`})
export class AddGameComponent {
  private fb = inject(NonNullableFormBuilder); private service = inject(GameService); private router = inject(Router);
  saving = signal(false); error = signal(''); attempted = signal(false);
  private text = [Validators.required, Validators.pattern(/.*\S.*/)];
  form = this.fb.group({title:['',[...this.text,Validators.maxLength(150)]],genre:['',[...this.text,Validators.maxLength(80)]],platform:['',[...this.text,Validators.maxLength(80)]],release_year:[2026,[Validators.required,Validators.min(1950),Validators.max(2100),Validators.pattern(/^\d+$/)]]});
  submit() {
    this.attempted.set(true); if(this.form.invalid || this.saving()) return;
    this.saving.set(true); this.error.set('');
    this.service.create(this.form.getRawValue()).subscribe({next: () => { void this.router.navigateByUrl('/dashboard'); },error: () => {this.saving.set(false);this.error.set('No se pudo guardar. Comprueba los datos, el backend y tu sesión.');}});
  }
}
