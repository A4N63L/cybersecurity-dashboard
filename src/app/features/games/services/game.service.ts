import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Game, NewGame } from '../models/game';
@Injectable({providedIn:'root'})
export class GameService {
  private http = inject(HttpClient);
  list() { return this.http.get<Game[]>(environment.apiUrl + '/games'); }
  create(game: NewGame) { return this.http.post<Game>(environment.apiUrl + '/games', game); }
}
