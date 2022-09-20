import { Component, ElementRef, Input, OnInit } from '@angular/core';
import {
  GameResponse,
  Requirements,
} from 'src/app/games/interfaces/game.interface';

@Component({
  selector: 'app-game-requirements',
  templateUrl: './game-requirements.component.html',
})
export class GameRequirementsComponent implements OnInit {
  @Input() game!: GameResponse;

  constructor() {}

  ngOnInit(): void {}
}
