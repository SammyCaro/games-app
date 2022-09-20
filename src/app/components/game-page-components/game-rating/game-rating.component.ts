import { Component, Input, OnInit } from '@angular/core';

import { GameResponse, Rating } from 'src/app/games/interfaces/game.interface';

@Component({
  selector: 'app-game-rating',
  templateUrl: './game-rating.component.html',
})
export class GameRatingComponent implements OnInit {
  @Input() game!: GameResponse;

  constructor() {}

  ngOnInit(): void {}
}
