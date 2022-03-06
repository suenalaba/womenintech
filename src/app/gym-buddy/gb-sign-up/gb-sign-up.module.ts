import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbSignUpPageRoutingModule } from './gb-sign-up-routing.module';

import { GbSignUpPage } from './gb-sign-up.page';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbSignUpPageRoutingModule,
    SwiperModule,
    ReactiveFormsModule
  ],
  declarations: [GbSignUpPage]
})
export class GbSignUpPageModule {}
