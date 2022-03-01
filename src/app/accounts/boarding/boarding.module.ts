import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BoardingPageRoutingModule } from './boarding-routing.module';

import { BoardingPage } from './boarding.page';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BoardingPageRoutingModule,
    SwiperModule
  ],
  declarations: [BoardingPage]
})
export class BoardingPageModule {}
