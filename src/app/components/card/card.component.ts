import { Component, Input, OnInit } from '@angular/core';

import { Result } from 'src/app/games/interfaces/games.interface';
import { GamesService } from 'src/app/games/services/games.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./pagination.css'],
})
export class CardComponent implements OnInit {
  games: Result[] = [];
  gameRating!: Result;
  @Input() totalGenreRecords!: number;

  /* pagination */
  page: number = 1;
  totalRecords!: number;

  starRating = 0;

  constructor(private gamesService: GamesService) {}

  ngOnInit(): void {
    this.getAllData();
    //console.log('desde card');
    this.totalGenreRecords;
    //console.log(this.totalGenreRecords);
  }

  getAllData() {
    this.gamesService.games().subscribe(
      (data) => {
        //console.log('desde el card');
        //console.log(data.results);
        this.games = data.results;
        this.totalRecords = data.count;
      },
      (err) => {
        this.games = [];
        console.log(err);
      }
    );
  }
}
