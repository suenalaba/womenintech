import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WorkoutSummaryPage } from './workout-summary.page';

const routes: Routes = [
  {
    path: '',
    component: WorkoutSummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkoutSummaryPageRoutingModule {}
