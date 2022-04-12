import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbUpdateAccountPreferencePageRoutingModule } from './gb-update-account-preference-routing.module';

import { GbUpdateAccountPreferencePage } from './gb-update-account-preference.page';

import { SwiperModule } from 'swiper/angular';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../../../../../src/environments/environment';
import { FormatFileSizePipe } from '../gb-sign-up/format-file-size.pipe';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbUpdateAccountPreferencePageRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule
  ],
  declarations: [GbUpdateAccountPreferencePage,FormatFileSizePipe]
})
export class GbUpdateAccountPreferencePageModule {}
