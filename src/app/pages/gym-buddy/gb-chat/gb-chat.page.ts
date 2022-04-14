import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { GymBuddyProfileInfo } from '../gb-findbuddy/GymBuddyInformation';
import { GbDeleteBuddyModalPage } from '../gb-delete-buddy-modal/gb-delete-buddy-modal.page';
import { GbShareWorkoutModalPage } from '../gb-share-workout-modal/gb-share-workout-modal.page';
@Component({
  selector: 'app-gb-chat',
  templateUrl: './gb-chat.page.html',
  styleUrls: ['./gb-chat.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

/**
 * This class is use to initialize contents in the chat page and updates in real time through the observer pattern.
 * The class also detects any changes based on user inputs and acts as intermediate class for data routing to the back end.
 */
export class GbChatPage implements OnInit, AfterContentChecked {
  private buddyName: string = null;
  private buddyProfilePicture: string = null;
  private buddyUserId: string = null;
  @ViewChild(IonContent) private content: IonContent;
  private currentUser: GymBuddyProfileInfo = null;
  public allChatMessages;
  public modalDataResponse = false;
  public newMessage = '';
  constructor(private chatService: ChatService, private router: Router,
      private cdRef: ChangeDetectorRef, public modalController: ModalController) {}

  /**
   * Getter for the current user id.
   *
   * @returns the current user id.
   */
  public getCurrentUserId() {
    return this.currentUser.getUserId;
  }

  /**
   * A getter for the secondary user's name for display.
   *
   * @returns full name of the secondary user.
   */
  public getSelectedChatBuddyName() {
    return this.buddyName;
  }

  /**
   * A getter for the secondary user's profile picture.
   *
   * @returns secondary user profile picture as a url that can be display as an image.
   */
  public getSelectedChatBuddyProfilePicture() {
    return this.buddyProfilePicture;
  }

  /**
   * Getter to get whether the user is a primary user or secondary user.
   *
   * @param fromId reference id of the user.
   * @returns 'my-message' if the user is the primary user and 'other-message' if the message is by the secondary user.
   */
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

  /**
   * This method checks whether a message was the last sent message by the primary user.
   *
   * @param fromId the reference id of the user sending the message.
   * @param isLastMessage a boolean that checks whether it is the last message by primary user.
   * @returns true if a message was the last sent message by the primary user.
   */
  public isLastMessageSentByMe(fromId: string, isLastMessage: boolean): boolean {
    if (fromId === this.getCurrentUserId() && isLastMessage) {
      return true;
    }
    return false;
  }

  /**
   * This methods check whether a message was the last sent message by the secondary user.
   *
   * @param fromId the reference id of the user sending the message.
   * @param isLastMessage a boolean that checks whether the message was the last message
   * @returns true if a message was sent the last sent message by the secondary user.
   */
  public isLastMessageSentByOther(fromId: string, isLastMessage): boolean {
    if (fromId !== this.getCurrentUserId() && isLastMessage) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether message is sent by the primary app user(myself).
   *
   * @param fromId the reference id of the user that sent the message.
   * @param isLastMessage a boolean that checks whether message was the last sent message.
   * @returns true if it's a message sent by primary user and is not the last message.
   */
  public isNotLastMessageSentByMe(fromId: string, isLastMessage: boolean): boolean {
    if (fromId === this.getCurrentUserId() && !isLastMessage) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether a message is sent by the secondary user and is not the last message.
   *
   * @param fromId the reference id of the user that sent the message.
   * @param isLastMessage a boolean that checks whether message was the last sent message.
   * @returns true if it's a message sent by secondary user and is not the last message.
   */
  public isNotLastMessageSentByOther(fromId: string, isLastMessage: boolean): boolean {
    if (fromId !== this.getCurrentUserId() && !isLastMessage) {
      return true;
    }
    return false;
  }

  /**
   * Checks whether message is sent by the primary user id.
   *
   * @param fromId reference id of the person sends the message.
   * @returns true if the message is sent by the primary user.
   */
  public isSentByMe(fromId: string): boolean {
    if (fromId === this.getCurrentUserId()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * This method is triggered on user click and will navigate the user to the gym buddy list home page.
   */
  public async navigateChatPageToBuddyListPage() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-buddylist-home', { replaceUrl: true });
  }

  /**
   * This method is triggered on user click and will navigate the user to workout list page.
   */
  public async navigateToWorkoutListPage() {
    this.router.navigateByUrl('tabs/workouts', { replaceUrl: true });
  }

  /**
   * A callback method that is invoked immediately after the default change detector has completed checking all of the directive's content.
   */
  ngAfterContentChecked() {
    this.cdRef.detectChanges();
}
  /**
   * This method is invoked upon entry point into the page. It displays all the chat messages with real-time updates.
   * This method subscribes to the observable in chat service.
   */
  async ngOnInit() {
    this.modalDataResponse = false;
    this.allChatMessages = this.chatService.getAllChatMessages();
    this.buddyName = this.chatService.getSelectedChatUserName;
    this.buddyProfilePicture = this.chatService.getSelectedOtherUserProfilePicture;
    this.buddyUserId = this.chatService.getSelectedOtherUserId;
    this.currentUser = this.chatService.getCurrentUser;
  }

  /**
   * This method is called when the user clicks on the delete user function, a modal will pop up for further user action.
   */
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

  /**
   * This method is called when the user clicks on the share workout function, a modal will pop for further user action.
   */
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

  /**
   * Adds chat messages to the chat service and scrolls to bottom when a new message is pinged.
   *
   * @returns if the user message is empty.
   */
  public sendMessage() {
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
