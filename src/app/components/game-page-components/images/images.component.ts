import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { GameResponse } from 'src/app/games/interfaces/game.interface';

import { GamesService } from 'src/app/games/services/games.service';
import { Results } from '../../../games/interfaces/gameScreenshot.interface';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
})
export class ImagesComponent implements OnInit {
  @Input() game!: GameResponse;
  gameScreenshots: Results[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private gamesService: GamesService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          return this.gamesService.getGameScreenshots(id);
        })
      )
      .subscribe((gameScreenshots) => {
        this.gameScreenshots = gameScreenshots.results;
        //console.log(this.gameScreenshots);
      });
  }
}
