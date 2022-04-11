import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StartWorkoutPageRoutingModule } from './start-workout-routing.module';

import { StartWorkoutPage } from './start-workout.page';
import { DisplayWorkoutComponentModule } from 'src/app/components/display-workout/display-workout.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StartWorkoutPageRoutingModule,
    DisplayWorkoutComponentModule,
  ],
  declarations: [StartWorkoutPage]
})
export class StartWorkoutPageModule {}
