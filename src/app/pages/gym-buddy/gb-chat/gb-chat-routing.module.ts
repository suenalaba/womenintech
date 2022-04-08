import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GbChatPage } from './gb-chat.page';

const routes: Routes = [
  {
    path: '',
    component: GbChatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GbChatPageRoutingModule {}
