import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { updateCurrentUser } from 'firebase/auth';
import { GbDeleteBuddyModalPage } from '../gb-delete-buddy-modal/gb-delete-buddy-modal.page';
import { GbShareWorkoutModalPage } from '../gb-share-workout-modal/gb-share-workout-modal.page';
@Component({
  selector: 'app-gb-chat',
  templateUrl: './gb-chat.page.html',
  styleUrls: ['./gb-chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GbChatPage implements OnInit, AfterContentChecked {

  @ViewChild(IonContent) content: IonContent;

  public modalDataResponse = false;

  newMessage = '';
  allChatMessages;
  messages: Observable<any[]>;
  private currentUser: GymBuddyProfileInfo = null;
  private otherUser: GymBuddyProfileInfo = null;

  private buddyName: string = null;
  private buddyUserId: string = null;
  private buddyProfilePicture: string = null;

  //public currentUserId: string = this.currentUser.getUserId;
  //@ViewChild(IonContent) content: IonContent;

  //messages: Observable<any[]>;


  constructor(private chatService: ChatService,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              public modalController: ModalController) {}

  public getSelectedChatBuddyName() {
    return this.buddyName;
  }

  public getSelectedChatBuddyProfilePicture() {
    return this.buddyProfilePicture;
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
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
    this.modalDataResponse = false;
    this.allChatMessages = this.chatService.getAllChatMessages();
    this.buddyName = this.chatService.getSelectedChatUserName;
    this.buddyProfilePicture = this.chatService.getSelectedOtherUserProfilePicture;
    this.buddyUserId = this.chatService.getSelectedOtherUserId;
    this.currentUser = this.chatService.getCurrentUser;
    /*this.currentUser = await this.chatService.retrieveCurrentUser();*/
    //this.messages = this.chatService.getChatMessages();
  }

  public async openDeleteModal() {
    const modal = await this.modalController.create({
      component: GbDeleteBuddyModalPage,
      cssClass: 'small-modal'
    });

    modal.onDidDismiss().then((modalDataResponse) => {
      if (modalDataResponse.data === true) {
        //proceed to Delete.
        //delete the match in fireStore.
        this.chatService.deleteMatch(this.chatService.getSelectedChatId, this.getCurrentUserId(),this.buddyUserId);
        this.modalDataResponse = modalDataResponse.data;
        console.log('Modal Sent Data : '+ modalDataResponse.data);
        //navigate back to buddy list page.
        this.navigateChatPageToBuddyListPage();
      } else {
        //don't do anything
        this.modalDataResponse = modalDataResponse.data;
        console.log('Modal Sent Data : '+ modalDataResponse.data);
      }
    });

    await modal.present();
  }

  public async openShareModal() {
    const modal = await this.modalController.create({
      component: GbShareWorkoutModalPage,
      cssClass: 'small-modal'
    });

    modal.onDidDismiss().then(async (modalDataResponse) => {
      if (modalDataResponse.data === true) {
        //proceed to share workout.
        //share workout over fireStore.
        this.modalDataResponse = modalDataResponse.data;
        console.log('Modal Sent Data : '+ modalDataResponse.data);
        //navigate back to buddy list page.
        console.log('going here.');
        await this.chatService.shareWorkout(this.getCurrentUserId(),this.buddyUserId);
        //this.navigateToWorkoutListPage();
      } else {
        //don't do anything
        this.modalDataResponse = modalDataResponse.data;
        console.log('Modal Sent Data : '+ modalDataResponse.data);
      }
    });

    await modal.present();
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

  get getProfilePicture() {
    return this.currentUser.profilePicture;
  }

  public isSentByMe(fromId: string): boolean {
    if (fromId === this.getCurrentUserId()) {
      return true; //sent by me.
    } else {
      return false;
    }
  }

  /**
   * Checks whether message is sent by the primary app user(myself).
   *
   * @param fromId the User Id that sent the message.
   * @returns true if it's a message sent by primary user.
   */
  public isNotLastMessageSentByMe(fromId: string, isLastMessage: boolean): boolean {
    if (fromId === this.getCurrentUserId() && !isLastMessage) {
      return true;
    }
    return false;
  }

  public isNotLastMessageSentByOther(fromId: string, isLastMessage: boolean): boolean {
    if (fromId !== this.getCurrentUserId() && !isLastMessage) {
      return true;
    }
    return false;
  }

  public isLastMessageSentByMe(fromId: string, isLastMessage: boolean): boolean {
    if (fromId === this.getCurrentUserId() && isLastMessage) {
      return true;
    }
    return false;
  }

  public isLastMessageSentByOther(fromId: string, isLastMessage): boolean {
    if (fromId !== this.getCurrentUserId() && isLastMessage) {
      return true;
    }
    return false;
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

  async navigateToWorkoutListPage() {
    this.router.navigateByUrl('tabs/workouts', { replaceUrl: true });
  }


  sendMessage() {
    if(this.newMessage === '') {
      return; //don't do anything if its an empty message.
    }
    console.log('Message sent: ', this.newMessage);
    this.chatService.addChatMessage(this.newMessage).then(() => {
      this.newMessage = '';
      this.content.scrollToBottom();
    });
  }
}
