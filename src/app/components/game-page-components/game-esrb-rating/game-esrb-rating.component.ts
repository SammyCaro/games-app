import { Component, Input, OnInit } from '@angular/core';
import { GameResponse } from 'src/app/games/interfaces/game.interface';

@Component({
  selector: 'app-game-esrb-rating',
  templateUrl: './game-esrb-rating.component.html',
  styles: [
    `
      .ratingTitle {
        margin-bottom: 0 !important;
      }
    `,
  ],
})
export class GameEsrbRatingComponent implements OnInit {
  @Input() game!: GameResponse;
  constructor() {}

  ngOnInit(): void {}
}
