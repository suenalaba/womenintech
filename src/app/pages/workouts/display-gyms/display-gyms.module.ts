import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayGymsPageRoutingModule } from './display-gyms-routing.module';

import { DisplayGymsPage } from './display-gyms.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisplayGymsPageRoutingModule
  ],
  declarations: [DisplayGymsPage]
})
export class DisplayGymsPageModule {}
