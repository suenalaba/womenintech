import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CompletedWorkoutsPage } from './completedworkouts.page';

const routes: Routes = [
  {
    path: '',
    component: CompletedWorkoutsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompletedWorkoutsPageRoutingModule {}
