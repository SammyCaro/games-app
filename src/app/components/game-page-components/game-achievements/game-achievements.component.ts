import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { Results } from 'src/app/games/interfaces/gameAchievements.interface';

import { GamesService } from 'src/app/games/services/games.service';

@Component({
  selector: 'app-game-achievements',
  templateUrl: './game-achievements.component.html',
})
export class GameAchievementsComponent implements OnInit {
  gameAchievements: Results[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.gamesService.getGameAchievements(id);
        })
      )
      .subscribe(
        (game) => {
          this.gameAchievements = game.results;
          //console.log(this.gameAchievements);
        },
        (err) => {
          this.gameAchievements = [];
          console.log(err);
        }
      );
  }
}
