import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayWorkoutComponent } from './display-workout.component';

import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from 'src/app/services/youtube.service';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, HttpClientModule],
  declarations: [DisplayWorkoutComponent, SafePipe],
  exports: [DisplayWorkoutComponent]
})
export class DisplayWorkoutComponentModule {}
