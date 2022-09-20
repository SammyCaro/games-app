import { Component, Input, OnInit } from '@angular/core';
import { GameResponse } from 'src/app/games/interfaces/game.interface';

@Component({
  selector: 'app-game-field-set',
  templateUrl: './game-field-set.component.html',
  styleUrls: ['./game-field-set.component.css'],
})
export class GameFieldSetComponent implements OnInit {
  @Input() game!: GameResponse;
  constructor() {}

  ngOnInit(): void {}
}
