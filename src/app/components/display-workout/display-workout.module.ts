import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisplayWorkoutComponent } from './display-workout.component';

import { SafePipe } from '../../services/youtube.service';

import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, SwiperModule],
  declarations: [DisplayWorkoutComponent, SafePipe],
  exports: [DisplayWorkoutComponent]
})
export class DisplayWorkoutComponentModule {}