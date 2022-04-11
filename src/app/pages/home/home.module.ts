import { IonicModule } from '@ionic/angular';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { ExploreContainerComponentModule } from '../../explore-container/explore-container.module';

import { HomePageRoutingModule } from './home-routing.module';
import { SwiperModule } from 'swiper/angular';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { SafePipe } from './home.page';

//import { YoutubeVideoPlayer } from '@ionic-native/youtube-video-player/ngx';
//import { RouteReuseStrategy } from '@angular/router';
//import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

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
    HttpClientModule
  ],
  //providers: [
  //  YoutubeVideoPlayer,
  //  {
  //    provide: RouteReuseStrategy,
  //    useClass: IonicRouteStrategy
  //  }
  //],
  declarations: [HomePage, SafePipe],
  schemas: [NO_ERRORS_SCHEMA],
})
export class HomePageModule {}
