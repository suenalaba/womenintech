import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EditWorkoutComponent } from './edit-workout.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, ReactiveFormsModule],
  declarations: [EditWorkoutComponent],
  exports: [EditWorkoutComponent]
})
export class EditWorkoutComponentModule {}
