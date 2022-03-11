import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateWorkoutsPage } from './create-workouts.page';

const routes: Routes = [
  {
    path: '',
    component: CreateWorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateWorkoutsPageRoutingModule {}
