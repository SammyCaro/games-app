import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Results } from 'src/app/games/interfaces/gameSeries.interface';

import { GamesService } from 'src/app/games/services/games.service';

@Component({
  selector: 'app-game-series',
  templateUrl: './game-series.component.html',
})
export class GameSeriesComponent implements OnInit {
  gameSeries: Results[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.gamesService.getGameSeries(id);
        }),
        tap(console.log)
      )
      .subscribe(
        (game) => {
          this.gameSeries = game.results;
          //console.log(this.gameSeries);
        },
        (err) => {
          this.gameSeries = [];
          console.log(err);
        }
      );
  }

  onClick() {
    window.scrollTo(0, 0);
  }
}
