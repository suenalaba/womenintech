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

/**
 * This class is use to initialize contents in the chat display home page.
 * The class also detects any changes based on user inputs and acts as intermediate class for data routing to the back end.
 */
export class GbBuddylistHomePage implements OnInit {

  public activeTab = 'chats'; //for tab

  private allChatInfo;
  private currentUser: GymBuddyProfileInfo;
  private chatNameAndMessagesMap: Map<string, string[]>;

  private loadingPresent = false;


  constructor(
    private chatService: ChatService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  public get getProfilePicture() {
    return this.currentUser.profilePicture;
  }

  public get getAllChatInfoList() {
    return this.allChatInfo;
  }

  public get getChatNameAndMessagesMap() {
    return this.chatNameAndMessagesMap;
  }

  /**
   * Invoked the moment the class is instantiated.
   * It fetches current user, chat information and chat names and messages from chat service.
   */
  async ngOnInit() {
    //display loading controller.
    this.showLoading();
    //get user data.
    this.currentUser = await this.chatService.retrieveCurrentChatUser();
    console.log('The current user is: ' + this.currentUser.getUserId);
    this.allChatInfo = await this.chatService.retrieveAllChatsFromDB();
    this.chatNameAndMessagesMap = await this.chatService.getGbListHomeDisplayFromDB();
    //dismiss loading.
    this.dismissLoading();
  }

  /**
   * An ionic tab function that updates the tab upon detection of user action.
   *
   * @param e user action log.
   */
  public segmentChange(e) {
    this.activeTab = e.target.value;
  }

  /**
   *  This method is called upon button trigger by user that will navigate the user to the gym buddy home page.
   */
  public async navigateBuddyListToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }

  /**
   * This method is called upon button trigger by user that will navigate the user to the selected chat.
   *
   * @param selectedChatUserName username of the secondary user
   * @param selectedChatId chat reference id of the chat
   * @param otherUserIdOfSelectedChat secondary user's user id
   * @param otherUserProfilePictureOfSelectedChat secondary user's profile picture reference
   */
  public async navigateBuddyListToChat(selectedChatUserName: string, selectedChatId: string,
      otherUserIdOfSelectedChat: string, otherUserProfilePictureOfSelectedChat: string) {
    console.log('This chat ID was selected: ' + selectedChatId);
    //set the selected chat in the chat service, so the navigation will be selected accordingly.
    this.chatService.setSelectedOtherUserId = otherUserIdOfSelectedChat;
    this.chatService.setSelectedChatId = selectedChatId;
    this.chatService.setSelectedChatUserName = selectedChatUserName;
    this.chatService.setSelectedOtherUserProfilePicture = otherUserProfilePictureOfSelectedChat;
    this.router.navigateByUrl('tabs/gym-buddy/gb-chat', { replaceUrl: true });
  }

  /**
   * Checks whether there is any message in the chat, if there is an existing message, the chat is not new
   * and the method will return false.
   *
   * @param message each message of the chat.
   * @returns true if the chat is new.
   */
  public isNewChat(message: string) {
    if(message === 'Start chatting with this user.') {
      return true;
    } else {
      return false;
    }
  }

  /**
   * To display a loading toast while user waits for the page to load.
   */
  private async showLoading() {
    this.loadingPresent = true;
    const load = await this.loadingController.create({
      message: 'Retrieving your chats, hang in there!',

    });
    await load.present();
  }

  /**
   * To dismiss the loading toast once information has loaded.
   */
  private async dismissLoading() {
    if (this.loadingPresent) {
      await this.loadingController.dismiss();
    }
    this.loadingPresent = false;
  }
}

