import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbFindbuddyPageRoutingModule } from './gb-findbuddy-routing.module';

import { GbFindbuddyPage } from './gb-findbuddy.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbFindbuddyPageRoutingModule
  ],
  declarations: [GbFindbuddyPage]
})
export class GbFindbuddyPageModule {}
