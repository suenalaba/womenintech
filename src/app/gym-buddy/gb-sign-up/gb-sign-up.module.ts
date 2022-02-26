import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbSignUpPageRoutingModule } from './gb-sign-up-routing.module';

import { GbSignUpPage } from './gb-sign-up.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbSignUpPageRoutingModule
  ],
  declarations: [GbSignUpPage]
})
export class GbSignUpPageModule {}
