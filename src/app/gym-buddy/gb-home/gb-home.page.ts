import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gb-home',
  templateUrl: './gb-home.page.html',
  styleUrls: ['./gb-home.page.scss'],
})
export class GbHomePage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  signUp(){
    this.router.navigateByUrl('tabs/gym-buddy/gb-sign-up', { replaceUrl: true });
  }

}
