import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbBuddylistHomePageRoutingModule } from './gb-buddylist-home-routing.module';

import { GbBuddylistHomePage } from './gb-buddylist-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbBuddylistHomePageRoutingModule
  ],
  declarations: [GbBuddylistHomePage]
})
export class GbBuddylistHomePageModule {}
