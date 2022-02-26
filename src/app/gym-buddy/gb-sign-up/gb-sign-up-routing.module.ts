import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbSignUpPage } from './gb-sign-up.page';

const routes: Routes = [
  {
    path: '',
    component: GbSignUpPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbSignUpPageRoutingModule {}
