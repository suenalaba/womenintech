import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbHomePage } from './gb-home.page';

const routes: Routes = [
  {path: '', component: GbHomePage},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbHomePageRoutingModule {}
