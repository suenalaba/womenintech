import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbBuddylistHomePage } from './gb-buddylist-home.page';

const routes: Routes = [
  {
    path: '',
    component: GbBuddylistHomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbBuddylistHomePageRoutingModule {}
