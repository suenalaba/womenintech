import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbFindBuddyBoardingPage } from './gb-find-buddy-boarding.page';

const routes: Routes = [
  {
    path: '',
    component: GbFindBuddyBoardingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbFindBuddyBoardingPageRoutingModule {}
