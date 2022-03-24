import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
import { SwiperModule } from 'swiper/angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    HomePageRoutingModule,
    SwiperModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    YouTubePlayerModule,
    HttpClientModule
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
