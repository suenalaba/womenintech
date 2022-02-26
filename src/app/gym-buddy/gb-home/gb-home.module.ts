import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbHomePageRoutingModule } from './gb-home-routing.module';

import { GbHomePage } from './gb-home.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbHomePageRoutingModule
  ],
  declarations: [GbHomePage]
})
export class GbHomePageModule {}
