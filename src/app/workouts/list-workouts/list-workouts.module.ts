import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListWorkoutsPageRoutingModule } from './list-workouts-routing.module';

import { ListWorkoutsPage } from './list-workouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListWorkoutsPageRoutingModule
  ],
  declarations: [ListWorkoutsPage]
})
export class ListWorkoutsPageModule {}
