import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayWorkoutComponent } from './display-workout.component';

import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from './display-workout.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, HttpClientModule],
  declarations: [DisplayWorkoutComponent, SafePipe],
  exports: [DisplayWorkoutComponent]
})
export class DisplayWorkoutComponentModule {}