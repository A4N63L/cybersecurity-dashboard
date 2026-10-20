import { Component, inject, OnInit } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AuthService } from './core/auth/auth.service';
import { LoginComponent } from './features/login/login.component';
import { DashboardComponent } from './features/games/dashboard/dashboard.component';
import { AddGameComponent } from './features/games/add-game/add-game.component';
@Component({standalone: true, template: '<p class="notice">Completando la autenticación…</p>'})
class CallbackComponent implements OnInit {
  private auth = inject(AuthService); private router = inject(Router);
  ngOnInit(): void { void this.router.navigateByUrl(this.auth.authenticated() ? '/dashboard' : '/login', {replaceUrl: true}); }
}
export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'auth/callback', component: CallbackComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [authGuard]},
  {path: 'games/new', component: AddGameComponent, canActivate: [authGuard]},
  {path: '', pathMatch: 'full', redirectTo: 'dashboard'},
  {path: '**', redirectTo: 'dashboard'}
];
