import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
=======
import { FormsModule } from '@angular/forms';
>>>>>>> b1a9f438220138b6ec21fa6158bbb2a5540ff3db

import { IonicModule } from '@ionic/angular';

import { EditWorkoutPageRoutingModule } from './edit-workout-routing.module';

import { EditWorkoutPage } from './edit-workout.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
<<<<<<< HEAD
    EditWorkoutPageRoutingModule,
    ReactiveFormsModule
=======
    EditWorkoutPageRoutingModule
>>>>>>> b1a9f438220138b6ec21fa6158bbb2a5540ff3db
  ],
  declarations: [EditWorkoutPage]
})
export class EditWorkoutPageModule {}
