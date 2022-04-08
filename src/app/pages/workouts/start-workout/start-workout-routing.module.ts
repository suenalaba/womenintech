import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StartWorkoutPage } from './start-workout.page';

const routes: Routes = [
  {
    path: '',
    component: StartWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StartWorkoutPageRoutingModule {}
