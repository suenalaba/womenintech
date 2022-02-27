import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IonicSwiper } from '@ionic/angular';

import SwiperCore, { Keyboard, Pagination, Scrollbar } from 'swiper';

SwiperCore.use([Keyboard, Pagination, Scrollbar, IonicSwiper]);

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UserDetailsPage implements OnInit {
  progress = 0.0;
  slideIndex = 0;
  private gender: any;
  private slides: any;
  constructor() { }
  ngOnInit(){
    let userInfo_string  = localStorage.getItem('userInfo');
    let userInfo =  JSON.parse(userInfo_string);
    this.gender = userInfo.gender;
    console.log(this.gender)
  }
  
  setSwiperInstance(swiper: any) {
    this.slides = swiper;
    this.slideIndex = this.slides.activeIndex;

  }

  public slideDidChange() {
    console.log('Slide did change');
    if (!this.slides) return;

    console.table({
      isBeginning: this.slides.isBeginning,
      isEnd: this.slides.isEnd
    });

    this.progress = this.getProgress(this.slides.activeIndex);
  }

  public slideWillChange() {
    console.log('Slide will change');
  }

  public getProgress(i){
    let val = (i+1) * 0.18;
    console.log(val);
    return val;
  }

  nextPage(){
    console.log(this.slides);
    this.slides.slideNext();
  }
}
