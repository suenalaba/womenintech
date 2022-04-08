import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbChatPageRoutingModule } from './gb-chat-routing.module';

import { GbChatPage } from './gb-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbChatPageRoutingModule
  ],
  declarations: [GbChatPage]
})
export class GbChatPageModule {}
