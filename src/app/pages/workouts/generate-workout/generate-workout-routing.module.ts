import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GenerateWorkoutPage } from './generate-workout.page';

const routes: Routes = [
  {
    path: '',
    component: GenerateWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateWorkoutPageRoutingModule {}
