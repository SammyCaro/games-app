import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './games/category/category.component';
import { GameComponent } from './games/game/game.component';
import { IndexComponent } from './games/index/index.component';
import { PlatformComponent } from './games/platform/platform.component';

const routes: Routes = [
  {
    //Ruta principal
    path: '',
    component: IndexComponent,
    pathMatch: 'full',
  },
  {
    path: 'category',
    component: CategoryComponent,
  },
  {
    path: 'platform',
    component: PlatformComponent,
  },
  {
    path: 'game/:id',
    component: GameComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class RoutesModule {}
