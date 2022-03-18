import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisplayGymsPage } from './display-gyms.page';

const routes: Routes = [
  {
    path: '',
    component: DisplayGymsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisplayGymsPageRoutingModule {}
