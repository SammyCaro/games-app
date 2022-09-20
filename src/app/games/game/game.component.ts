import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';

import { GamesService } from 'src/app/games/services/games.service';

import { GameResponse } from '../interfaces/game.interface';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements OnInit {
  game!: GameResponse;

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.gamesService.getGameById(id);
        })
      )
      .subscribe(
        (game) => {
          this.game = game;
          console.log('desde game component');
          console.log(this.game);
        },
        (err) => {
          this.game;
          console.log(err);
        }
      );
  }
}
