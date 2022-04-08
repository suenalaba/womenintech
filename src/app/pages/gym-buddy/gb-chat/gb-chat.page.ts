import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
@Component({
  selector: 'app-gb-chat',
  templateUrl: './gb-chat.page.html',
  styleUrls: ['./gb-chat.page.scss'],
})
export class GbChatPage implements OnInit {

  private currentUser: GymBuddyProfileInfo = null;
  private otherUser: GymBuddyProfileInfo = null;

  private buddyName: string = null;

  //@ViewChild(IonContent) content: IonContent;

  //messages: Observable<any[]>;
  //newMsg = '';

  constructor(private chatService: ChatService, private router: Router) {

   }

  public getSelectedChatBuddyName() {
    return this.buddyName;
  }

  async ngOnInit() {
    this.buddyName = this.chatService.getSelectedChatUserName;
    /*this.currentUser = await this.chatService.retrieveCurrentUser();*/
    //this.messages = this.chatService.getChatMessages();
  }

  /*sendMessage() {
    this.chatService.addChatMessage(this.newMsg).then(() => {
      this.newMsg = '';
      this.content.scrollToBottom();
    });
  }

  signOut() {
    this.chatService.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true });
    });
  }

*/
  async navigateChatPageToBuddyListPage() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-buddylist-home', { replaceUrl: true });
  }

  async sendMessage() {
    console.log('Message sent');
  }
}
