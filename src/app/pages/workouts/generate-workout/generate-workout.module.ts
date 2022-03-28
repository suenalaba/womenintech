import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GenerateWorkoutPageRoutingModule } from './generate-workout-routing.module';

import { GenerateWorkoutPage } from './generate-workout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerateWorkoutPageRoutingModule
  ],
  declarations: [GenerateWorkoutPage]
})
export class GenerateWorkoutPageModule {}
