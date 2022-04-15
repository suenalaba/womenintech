import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompletedWorkoutsPageRoutingModule } from './completedworkouts-routing.module';

import { CompletedWorkoutsPage } from './completedworkouts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompletedWorkoutsPageRoutingModule
  ],
  declarations: [CompletedWorkoutsPage]
})
export class CompletedWorkoutsPageModule {}
