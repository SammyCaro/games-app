import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import { GameResponse } from 'src/app/games/interfaces/game.interface';
import { Result } from 'src/app/games/interfaces/gameMovies.interface';
import { Results } from 'src/app/games/interfaces/gameScreenshot.interface';

import { GamesService } from 'src/app/games/services/games.service';

@Component({
  selector: 'app-game-movie',
  templateUrl: './game-movie.component.html',
})
export class GameMovieComponent implements OnInit {
  gameMovie: Result[] = [];
  gameScreenshot: Results[] = [];
  @Input() game!: GameResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.gamesService.getGameMovie(id);
        }),
        tap(console.log)
      )
      .subscribe(
        (game) => {
          this.gameMovie = game.results;
        },
        (err) => {
          this.gameMovie = [];
          console.log(err);
        }
      );

    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.gamesService.getGameScreenshots(id);
        })
      )
      .subscribe(
        (gameScreenshots) => {
          this.gameScreenshot = gameScreenshots.results;
          //console.log(this.gameScreenshot);
        },
        (err) => {
          this.gameScreenshot = [];
          console.log(err);
        }
      );
  }
}
