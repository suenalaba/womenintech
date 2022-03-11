import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListWorkoutsPage } from './list-workouts.page';

const routes: Routes = [
  {
    path: '',
    component: ListWorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListWorkoutsPageRoutingModule {}
