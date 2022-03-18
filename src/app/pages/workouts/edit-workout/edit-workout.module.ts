import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditWorkoutPageRoutingModule } from './edit-workout-routing.module';

import { EditWorkoutPage } from './edit-workout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditWorkoutPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [EditWorkoutPage]
})
export class EditWorkoutPageModule {}
