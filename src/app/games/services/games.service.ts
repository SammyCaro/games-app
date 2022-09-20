import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GameAchievementResponse } from '../interfaces/gameAchievements.interface';
import { GameScreenshotResponse } from '../interfaces/gameScreenshot.interface';
import { GamesResponse } from '../interfaces/games.interface';
import { GameResponse } from '../interfaces/game.interface';
import { GameSeriesResponse } from '../interfaces/gameSeries.interface';

@Injectable({
  providedIn: 'root',
})
export class GamesService {
  private apiUrl: string = 'https://api.rawg.io/api';
  private apiKey: string = 'key=00401f8fd3374ae6bde4959a78c79bb3';
  page: number = 1;

  constructor(private http: HttpClient) {}

  games(): Observable<GamesResponse> {
    const url = `${this.apiUrl}/games?${this.apiKey}&page=${this.page}&page_size=25`;
    this.page++;
    return this.http.get<GamesResponse>(url);
  }

  searchGenre(genre: number): Observable<GamesResponse> {
    const url = `${this.apiUrl}/games?${this.apiKey}&genres=${genre}&page=${this.page}&page_size=25`;
    this.page++;
    return this.http.get<GamesResponse>(url);
  }

  searchPlatform(platform: number): Observable<GamesResponse> {
    const url = `${this.apiUrl}/games?${this.apiKey}&platforms=${platform}`;
    this.page++;
    return this.http.get<GamesResponse>(url);
  }

  searchStore(store: number): Observable<GamesResponse> {
    const url = `${this.apiUrl}/games?${this.apiKey}&stores=${store}`;
    this.page++;
    return this.http.get<GamesResponse>(url);
  }

  searchGame(termino: string): Observable<GamesResponse> {
    const url = `${this.apiUrl}/games?${this.apiKey}&search=${termino}`;
    return this.http.get<GamesResponse>(url);
  }

  getGameById(id: string): Observable<GameResponse> {
    const url = `${this.apiUrl}/games/${id}?${this.apiKey}`;
    return this.http.get<GameResponse>(url);
  }

  getGameMovie(id: string): Observable<GamesResponse> {
    const url = `${this.apiUrl}/games/${id}/movies?${this.apiKey}`;
    return this.http.get<GamesResponse>(url);
  }

  getGameScreenshots(id: string): Observable<GameScreenshotResponse> {
    const url = `${this.apiUrl}/games/${id}/screenshots?${this.apiKey}`;
    return this.http.get<GameScreenshotResponse>(url);
  }

  getGameAchievements(id: string): Observable<GameAchievementResponse> {
    const url = `${this.apiUrl}/games/${id}/achievements?${this.apiKey}`;
    return this.http.get<GameAchievementResponse>(url);
  }

  getGameSeries(id: string): Observable<GameSeriesResponse> {
    const url = `${this.apiUrl}/games/${id}/game-series?${this.apiKey}`;
    return this.http.get<GameSeriesResponse>(url);
  }
}
