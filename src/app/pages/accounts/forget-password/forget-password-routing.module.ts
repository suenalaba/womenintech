import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForgetPasswordPage } from './forget-password.page';

const routes: Routes = [
  {
    path: '',
    component: ForgetPasswordPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForgetPasswordPageRoutingModule {}
