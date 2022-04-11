import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GbSignUpPageRoutingModule } from './gb-sign-up-routing.module';

import { GbSignUpPage } from './gb-sign-up.page';

import { SwiperModule } from 'swiper/angular';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../../../../../src/environments/environment';
import { FormatFileSizePipe } from './format-file-size.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GbSignUpPageRoutingModule,
    SwiperModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFirestoreModule
  ],
  declarations: [GbSignUpPage,FormatFileSizePipe]
})
export class GbSignUpPageModule {}
