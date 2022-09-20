import { Component, OnInit } from '@angular/core';
import { Result, GamesResponse } from '../interfaces/games.interface';
import { GamesService } from '../services/games.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styles: [
    `
      p {
        margin-bottom: 0 !important;
        align-self: end;
      }

      .platform-icon {
        position: relative;
        top: 6px;
      }
    `,
  ],
})
export class IndexComponent implements OnInit {
  /* genre filter */
  genres = [
    { name: 'All', slug: 0, icon: '../../../assets/icons/all.png' },
    {
      name: 'racing',
      slug: 1,
      icon: '../../../assets/icons/genres-icons/racing.png',
    },
    {
      name: 'shooter',
      slug: 2,
      icon: '../../../assets/icons/genres-icons/shooter.png',
    },
    {
      name: 'adventure',
      slug: 3,
      icon: '../../../assets/icons/genres-icons/adventure.png',
    },
    {
      name: 'action',
      slug: 4,
      icon: '../../../assets/icons/genres-icons/action.png',
    },
    {
      name: 'RPG',
      slug: 5,
      icon: '../../../assets/icons/genres-icons/rpg.png',
    },
    {
      name: 'puzzle',
      slug: 7,
      icon: '../../../assets/icons/genres-icons/puzzle.png',
    },
    {
      name: 'sports',
      slug: 15,
      icon: '../../../assets/icons/genres-icons/sports.png',
    },
  ];
  activeGenre: number = 1;
  activedGenres: boolean = false;
  /* genre filter */

  /* platform filter */
  platforms = [
    { name: 'All', slug: 0, icon: '../../../assets/icons/all.png' },
    {
      name: 'PC',
      slug: 4,
      icon: '../../../assets/icons/platforms-icons/windows.png',
    },
    {
      name: 'PlayStation 5',
      slug: 187,
      icon: '../../../assets/icons/platforms-icons/ps5.png',
    },
    {
      name: 'PlayStation 4',
      slug: 18,
      icon: '../../../assets/icons/platforms-icons/ps4.png',
    },
    {
      name: 'Xbox One',
      slug: 1,
      icon: '../../../assets/icons/platforms-icons/xbox.png',
    },
    {
      name: 'Nintendo Switch',
      slug: 7,
      icon: '../../../assets/icons/platforms-icons/switch.png',
    },
    {
      name: 'iOS',
      slug: 3,
      icon: '../../../assets/icons/platforms-icons/ios.png',
    },
    {
      name: 'Android',
      slug: 21,
      icon: '../../../assets/icons/platforms-icons/android.png',
    },
  ];
  activePlatform: number = 1;
  /* platform filter */

  /* store filter */

  stores = [
    { name: 'All', slug: 0, icon: '../../../assets/icons/all.png' },
    {
      name: 'Steam',
      slug: 1,
      icon: '../../../assets/icons/stores-icons/steam.png',
    },
    {
      name: 'Xbox Store',
      slug: 2,
      icon: '../../../assets/icons/stores-icons/xbox-store.png',
    },
    {
      name: 'PlayStation Store',
      slug: 3,
      icon: '../../../assets/icons/stores-icons/playstation-store.png',
    },
    {
      name: 'App Store',
      slug: 5,
      icon: '../../../assets/icons/stores-icons/app-store.png',
    },
    {
      name: 'Nintendo Store',
      slug: 6,
      icon: '../../../assets/icons/stores-icons/nintendo.png',
    },
    {
      name: 'GOG',
      slug: 7,
      icon: '../../../assets/icons/stores-icons/gog.png',
    },
    {
      name: 'Google Play',
      slug: 8,
      icon: '../../../assets/icons/stores-icons/google-play.png',
    },
    {
      name: 'Itch.io',
      slug: 8,
      icon: '../../../assets/icons/stores-icons/itch-io.png',
    },
    {
      name: 'Epic Games',
      slug: 11,
      icon: '../../../assets/icons/stores-icons/epic.png',
    },
  ];
  activeStore: number = 1;
  /* store filter */

  /* pagination */
  page: number = 1;
  totalGenreRecords!: number;

  termino: string = '';

  games: Result[] = [];
  juegosSugeridos: Result[] = [];

  mostrarSugerencias: boolean = false;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {}

  activateGenre(genre: number) {
    this.activeGenre = genre;
    this.games = [];

    this.gamesService.searchGenre(genre).subscribe(
      (games) => {
        this.games = games.results;
        this.totalGenreRecords = games.count;
        console.log(this.totalGenreRecords);
      },

      (err) => {
        //this.games = [];
        console.log(err);
      }
    );

    this.activedGenres = true;
  }

  activatePlatform(platform: number) {
    this.activePlatform = platform;
    this.games = [];

    this.gamesService.searchPlatform(platform).subscribe(
      (platforms) => {
        this.games = platforms.results;
        //this.totalplatformRecords = games.count;
        console.log(this.games);
      },

      (err) => {
        //this.games = [];
        console.log(err);
      }
    );
  }

  activateStore(store: number) {
    this.activeStore = store;
    this.games = [];

    this.gamesService.searchStore(store).subscribe(
      (stores) => {
        this.games = stores.results;
        //this.totalplatformRecords = games.count;
        console.log(this.games);
      },

      (err) => {
        //this.games = [];
        console.log(err);
      }
    );
  }

  search(termino: string) {
    this.termino = termino;

    this.gamesService.searchGame(this.termino).subscribe(
      (games) => {
        /* el array vacío de este componente es igual al array que devuelve la respuesta */
        if (this.termino.length == 0) {
          this.games = [];
        } else {
          this.games = games.results;
        }
        //console.log(this.games);
      },
      (err) => {
        this.games = [];
        console.log(err);
      }
    );
  }

  sugerencias(termino: string) {
    this.termino = termino;
    this.mostrarSugerencias = true;

    this.gamesService.searchGame(termino).subscribe(
      (games) => {
        this.juegosSugeridos = games.results;
      },
      (err) => (this.juegosSugeridos = [])
    );
  }
}
