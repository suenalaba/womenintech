import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gb-buddylist-home',
  templateUrl: './gb-buddylist-home.page.html',
  styleUrls: ['./gb-buddylist-home.page.scss'],
})
export class GbBuddylistHomePage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }
}
