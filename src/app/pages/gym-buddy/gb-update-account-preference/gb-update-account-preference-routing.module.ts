import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbUpdateAccountPreferencePage } from './gb-update-account-preference.page';

const routes: Routes = [
  {
    path: '',
    component: GbUpdateAccountPreferencePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbUpdateAccountPreferencePageRoutingModule {}
