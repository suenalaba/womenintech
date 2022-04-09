import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { updateCurrentUser } from 'firebase/auth';
@Component({
  selector: 'app-gb-chat',
  templateUrl: './gb-chat.page.html',
  styleUrls: ['./gb-chat.page.scss'],
})
export class GbChatPage implements OnInit {

  @ViewChild(IonContent) content: IonContent;
  newMessage = '';
  allChatMessages;
  messages: Observable<any[]>;
  private currentUser: GymBuddyProfileInfo = null;
  private otherUser: GymBuddyProfileInfo = null;

  private buddyName: string = null;
  private buddyUserId: string = null;

  //public currentUserId: string = this.currentUser.getUserId;
  //@ViewChild(IonContent) content: IonContent;

  //messages: Observable<any[]>;


  constructor(private chatService: ChatService, private router: Router) {

   }

  public getSelectedChatBuddyName() {
    return this.buddyName;
  }

  async ngOnInit() {
    // this.chatService.myObservable.subscribe((val) => {
    //   console.log(val);
    //   this.allChatMessages = val;
    //   console.log('This is what was imported: ', this.allChatMessages);
    // });
    // this.chatService.getAllChatMessages().subscribe((val) => {
    //   console.log(val);
    //   this.allChatMessages = val;
    //   console.log('This is what was imported: ', this.allChatMessages);
    // });
    this.allChatMessages = this.chatService.getAllChatMessages();
    this.buddyName = this.chatService.getSelectedChatUserName;
    this.buddyUserId = this.chatService.getSelectedOtherUserId;
    this.currentUser = this.chatService.getCurrentUser;
    /*this.currentUser = await this.chatService.retrieveCurrentUser();*/
    //this.messages = this.chatService.getChatMessages();
  }

  public getUserClass(fromId: string){
    console.log(fromId);
    if (fromId === this.getCurrentUserId()) {
      console.log('user');
      return 'my-message';
    }
    else {
      console.log('secondary user');
      return 'other-message';
    }
  }

  public isMyMessage(fromId: string) {
    if (fromId === this.getCurrentUserId()) {
      return true;
    }
    return false;
  }

  public getCurrentUserId() {
    return this.currentUser.getUserId;
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


  sendMessage() {
    console.log('Message sent: ', this.newMessage);
    this.chatService.addChatMessage(this.newMessage).then(() => {
      this.newMessage = '';
      this.content.scrollToBottom();
    });
  }
}
