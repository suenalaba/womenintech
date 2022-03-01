import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.page.html',
  styleUrls: ['./boarding.page.scss'],
})
export class BoardingPage implements OnInit {
  private slides: any;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  setSwiperInstance(swiper: any) {
    this.slides = swiper;

  }

  next() {
    this.slides.slideNext();
  }

  start(){
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

}
