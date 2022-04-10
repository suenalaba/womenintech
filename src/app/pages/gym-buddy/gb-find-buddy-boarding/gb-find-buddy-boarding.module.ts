import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbFindBuddyBoardingPageRoutingModule } from './gb-find-buddy-boarding-routing.module';

import { GbFindBuddyBoardingPage } from './gb-find-buddy-boarding.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbFindBuddyBoardingPageRoutingModule
  ],
  declarations: [GbFindBuddyBoardingPage]
})
export class GbFindBuddyBoardingPageModule {}
