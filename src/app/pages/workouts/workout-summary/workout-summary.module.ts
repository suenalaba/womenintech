import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WorkoutSummaryPageRoutingModule } from './workout-summary-routing.module';

import { WorkoutSummaryPage } from './workout-summary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WorkoutSummaryPageRoutingModule
  ],
  declarations: [WorkoutSummaryPage]
})
export class WorkoutSummaryPageModule {}
