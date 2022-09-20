import { Component, Input, OnInit } from '@angular/core';
import { GameResponse } from 'src/app/games/interfaces/game.interface';

@Component({
  selector: 'app-game-web-tags',
  templateUrl: './game-web-tags.component.html',
})
export class GameWebTagsComponent implements OnInit {
  @Input() game!: GameResponse;
  constructor() {}

  ngOnInit(): void {}
}
