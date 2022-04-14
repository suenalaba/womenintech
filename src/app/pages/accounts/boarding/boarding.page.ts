import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.page.html',
  styleUrls: ['./boarding.page.scss'],
})
export class BoardingPage implements OnInit {
  private slides: any;

  constructor(private router: Router, private authService: AuthenticationService,) { }

  ngOnInit() {
  }

  /**
   * show the different boarding pages
   * 
   * @param swiper 
   * 
   */
  setSwiperInstance(swiper: any) {
    this.slides = swiper;

  }

  /**
   * when next button is clicked
   */
  next() {
    this.slides.slideNext();
  }

  /**
   * start button is clicked
   */
  start(){
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

}
