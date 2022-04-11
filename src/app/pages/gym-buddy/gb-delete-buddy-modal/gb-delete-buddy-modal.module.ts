import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbDeleteBuddyModalPageRoutingModule } from './gb-delete-buddy-modal-routing.module';

import { GbDeleteBuddyModalPage } from './gb-delete-buddy-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbDeleteBuddyModalPageRoutingModule
  ],
  declarations: [GbDeleteBuddyModalPage]
})
export class GbDeleteBuddyModalPageModule {}
