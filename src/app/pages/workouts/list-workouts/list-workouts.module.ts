import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListWorkoutsPageRoutingModule } from './list-workouts-routing.module';

import { ListWorkoutsPage } from './list-workouts.page';
// import { CreateWorkoutComponent } from 'src/app/components/create-workout/create-workout.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListWorkoutsPageRoutingModule,
    ReactiveFormsModule
    // CreateWorkoutComponent
  ],
  declarations: [ListWorkoutsPage]
})
export class ListWorkoutsPageModule {}
