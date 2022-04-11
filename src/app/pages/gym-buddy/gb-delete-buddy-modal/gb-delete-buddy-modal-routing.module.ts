import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbDeleteBuddyModalPage } from './gb-delete-buddy-modal.page';

const routes: Routes = [
  {
    path: '',
    component: GbDeleteBuddyModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbDeleteBuddyModalPageRoutingModule {}
