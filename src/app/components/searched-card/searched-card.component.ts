import { Component, Input, OnInit } from '@angular/core';

import { Result } from 'src/app/games/interfaces/games.interface';
import { GamesService } from 'src/app/games/services/games.service';

@Component({
  selector: 'app-searched-card',
  templateUrl: './searched-card.component.html',
})
export class SearchedCardComponent implements OnInit {
  page: number = 1;
  @Input() totalGenreRecords!: number;

  @Input() games: Result[] = [] || [];
  @Input() activedGenres!: boolean;
  @Input() activateGenre: any;
  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    ///this.getAllData();
    ///this.totalGenreRecords;
  }

  getAllData() {
    if (this.activedGenres === true) {
      console.log('searched card');
      console.log(this.totalGenreRecords);
      this.activateGenre();
    }
  }
}

/*
this.gamesService.games().subscribe(
      (data) => {
        console.log('desde el card');
        console.log(data.results);
        this.games = data.results;
        this.totalRecords = data.count;
      },
      (err) => {
        this.games = [];
        console.log(err);
      }
    );
  }
*/
