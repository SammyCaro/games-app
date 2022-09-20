import { CommonModule } from '@angular/common';

import { BarRatingModule } from 'ngx-bar-rating';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { FormsModule } from '@angular/forms';
import { EventEmitter, NgModule } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

import { RouterModule } from '@angular/router';

import { CardComponent } from './card/card.component';
import { GameAchievementsComponent } from './game-page-components/game-achievements/game-achievements.component';
import { GameEsrbRatingComponent } from './game-page-components/game-esrb-rating/game-esrb-rating.component';
import { GameFieldSetComponent } from './game-page-components/game-field-set/game-field-set.component';
import { GameMovieComponent } from './game-page-components/game-movie/game-movie.component';
import { GameRatingComponent } from './game-page-components/game-rating/game-rating.component';
import { GameRequirementsComponent } from './game-page-components/game-requirements/game-requirements.component';
import { GameStoresComponent } from './game-page-components/game-stores/game-stores.component';
import { GameSeriesComponent } from './game-page-components/game-series/game-series.component';
import { GameWebTagsComponent } from './game-page-components/game-web-tags/game-web-tags.component';
import { ImagesComponent } from './game-page-components/images/images.component';
import { InputTextComponent } from './input-text/input-text.component';
import { SearchedCardComponent } from './searched-card/searched-card.component';

@NgModule({
  declarations: [
    CardComponent,
    GameAchievementsComponent,
    GameEsrbRatingComponent,
    GameFieldSetComponent,
    GameMovieComponent,
    GameStoresComponent,
    GameSeriesComponent,
    GameRatingComponent,
    GameRequirementsComponent,
    GameWebTagsComponent,
    InputTextComponent,
    ImagesComponent,
    SearchedCardComponent,
  ],
  imports: [
    BarRatingModule,
    ButtonModule,
    CommonModule,
    FieldsetModule,
    FormsModule,
    RouterModule,
    NgxPaginationModule,
  ],
  exports: [
    CardComponent,
    GameAchievementsComponent,
    GameEsrbRatingComponent,
    GameFieldSetComponent,
    GameMovieComponent,
    GameRatingComponent,
    GameRequirementsComponent,
    GameStoresComponent,
    GameSeriesComponent,
    GameWebTagsComponent,
    ImagesComponent,
    InputTextComponent,
    SearchedCardComponent,
  ],
  providers: [EventEmitter],
})
export class ComponentsModule {}
