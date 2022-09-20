import { Component, Input, OnInit } from '@angular/core';

import { GameResponse } from 'src/app/games/interfaces/game.interface';

@Component({
  selector: 'app-game-stores',
  templateUrl: './game-stores.component.html',
})
export class GameStoresComponent implements OnInit {
  @Input() game!: GameResponse;

  stores = [
    {
      name: 'Steam',
      slug: 'steam',
      icon: '../../../../assets/icons/stores-icons/steam.png',
    },
    {
      name: 'Xbox Store',
      slug: 'xbox-store',
      icon: '../../../../assets/icons/stores-icons/xbox-store.png',
    },
    {
      name: 'PlayStation Store',
      slug: 'playstation-store',
      icon: '../../../../assets/icons/stores-icons/playstation-store.png',
    },
    {
      name: 'App Store',
      slug: 'app-store',
      icon: '../../../../assets/icons/stores-icons/app-store.png',
    },
    {
      name: 'Nintendo Store',
      slug: 'nintendo',
      icon: '../../../../assets/icons/stores-icons/nintendo.png',
    },
    {
      name: 'GOG',
      slug: 7,
      icon: '../../../../assets/icons/stores-icons/gog.png',
    },
    {
      name: 'Google Play',
      slug: 'google-play',
      icon: '../../../../assets/icons/stores-icons/google-play.png',
    },
    {
      name: 'Itch.io',
      slug: 8,
      icon: '../../../../assets/icons/stores-icons/itch-io.png',
    },
    {
      name: 'Epic Games',
      slug: 'epic-games',
      icon: '../../../../assets/icons/stores-icons/epic.png',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
