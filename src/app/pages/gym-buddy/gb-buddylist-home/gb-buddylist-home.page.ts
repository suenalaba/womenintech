import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { ChatService } from 'src/app/services/chat.service';
@Component({
  selector: 'app-gb-buddylist-home',
  templateUrl: './gb-buddylist-home.page.html',
  styleUrls: ['./gb-buddylist-home.page.scss'],
})
export class GbBuddylistHomePage implements OnInit {

  private currentUser: GymBuddyProfileInfo;
  private router: Router;
  private loadingController: LoadingController;
  private chatService: ChatService;

  constructor(
  ) {
    this.chatService = this.chatService;
    this.router = this.router;
    this.loadingController = this.loadingController;
   }

  async ngOnInit() {
    /*this.currentUser = await this.chatService.retrieveCurrentUser();*/


  }

  async goToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }


}
