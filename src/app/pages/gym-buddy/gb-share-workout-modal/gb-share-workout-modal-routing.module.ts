import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbShareWorkoutModalPage } from './gb-share-workout-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GbShareWorkoutModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbShareWorkoutModalPageRoutingModule {}
