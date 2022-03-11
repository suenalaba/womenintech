import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbFindbuddyPage } from './gb-findbuddy.page';

const routes: Routes = [
  {
    path: '',
    component: GbFindbuddyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbFindbuddyPageRoutingModule {}
