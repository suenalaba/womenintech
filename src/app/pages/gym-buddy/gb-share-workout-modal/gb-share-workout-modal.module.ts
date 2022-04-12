import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbShareWorkoutModalPageRoutingModule } from './gb-share-workout-modal-routing.module';

import { GbShareWorkoutModalPage } from './gb-share-workout-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbShareWorkoutModalPageRoutingModule
  ],
  declarations: [GbShareWorkoutModalPage]
})
export class GbShareWorkoutModalPageModule {}
