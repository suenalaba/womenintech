import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-boarding',
  templateUrl: './boarding.page.html',
  styleUrls: ['./boarding.page.scss'],
})
/**
 * Screen users see when they first create account
 */
export class BoardingPage implements OnInit {
  private slides: any;

  constructor(private router: Router, private authService: AuthenticationService,) { }

  ngOnInit() {
  }

  /**
   * when next button is clicked
   */
  private next() {
    this.slides.slideNext();
  }

  /**
   * show the different boarding pages
   *
   * @param swiper
   */
  private setSwiperInstance(swiper: any) {
    this.slides = swiper;

  }

  /**
   * start button is clicked
   */
  private start(){
    this.router.navigateByUrl('/tabs', { replaceUrl: true });
  }

}
