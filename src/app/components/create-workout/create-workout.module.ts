import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateWorkoutComponent } from './create-workout.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  declarations: [CreateWorkoutComponent],
  exports: [CreateWorkoutComponent]
})
export class CreateWorkoutComponentModule {}
