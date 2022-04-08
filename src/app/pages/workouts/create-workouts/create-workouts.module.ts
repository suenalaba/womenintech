import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CreateWorkoutsPageRoutingModule } from './create-workouts-routing.module';

import { CreateWorkoutsPage } from './create-workouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateWorkoutsPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [CreateWorkoutsPage]
})
export class CreateWorkoutsPageModule {}
