import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditWorkoutPage } from './edit-workout.page';

const routes: Routes = [
  {
    path: '',
    component: EditWorkoutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditWorkoutPageRoutingModule {}
