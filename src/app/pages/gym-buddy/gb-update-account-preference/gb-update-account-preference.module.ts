import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbUpdateAccountPreferencePageRoutingModule } from './gb-update-account-preference-routing.module';

import { GbUpdateAccountPreferencePage } from './gb-update-account-preference.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbUpdateAccountPreferencePageRoutingModule
  ],
  declarations: [GbUpdateAccountPreferencePage]
})
export class GbUpdateAccountPreferencePageModule {}
