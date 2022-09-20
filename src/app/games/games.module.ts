import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ComponentsModule } from '../components/components.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';

import { CategoryComponent } from './category/category.component';
import { GameComponent } from './game/game.component';
import { IndexComponent } from './index/index.component';
import { PlatformComponent } from './platform/platform.component';

@NgModule({
  declarations: [
    IndexComponent,
    GameComponent,
    PlatformComponent,
    CategoryComponent,
  ],
  imports: [CommonModule, ComponentsModule, FontAwesomeModule, RouterModule],
  exports: [
    CategoryComponent,
    GameComponent,
    IndexComponent,
    PlatformComponent,
  ],
})
export class GamesModule {}
