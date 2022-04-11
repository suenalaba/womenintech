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


  private static readonly CHATID_INDEX = 1;

  activeTab = 'chats'; //for tab

  //array of hashmap storing <chatID, chatId> & <otherUser: otherUserId>
  //private allChatInfo: Map<string, string>[] = [];
  //private allChatInfo: string[] = [];
  private allChatInfo;
  //private allChatInfo: Map<string, string>[] boardPopulation= (HashMap<String, Integer>[])
  //Map<string, GymBuddyProfileInfo>;
  private currentUser: GymBuddyProfileInfo;
  private chatNameAndMessagesMap: Map<string, string[]>;



  constructor(
    private chatService: ChatService,
    private router: Router,
    private loadingController: LoadingController
  ) { }

  public get getAllChatInfoList() {
    return this.allChatInfo;
  }

  public get getChatNameAndMessagesMap() {
    return this.chatNameAndMessagesMap;
  }


  segmentChange(e) {
    this.activeTab = e.target.value;
  }

  async ngOnInit() {
    this.currentUser = await this.chatService.retrieveCurrentChatUser();
    console.log('The current user is: ' + this.currentUser.getUserId);
    this.allChatInfo = await this.chatService.retrieveAllChatsFromDB();
    //this.chatService.testPullFromDb();
    console.log(this.allChatInfo);
    console.log(this.allChatInfo[0].chatID);
    console.log(this.allChatInfo[0].otherUser);
    //this.chatService.getGbListHomeDisplayFromDB();
    this.chatNameAndMessagesMap = await this.chatService.getGbListHomeDisplayFromDB();
    this.chatNameAndMessagesMap.forEach((value: string[], key: string) => {
      console.log('Printing key value pair 1');
      console.log(key, value[0], value[1], value[2],value[3]);
    });
  }

  async navigateBuddyListToGBHome() {
    this.router.navigateByUrl('tabs/gym-buddy/gb-home', { replaceUrl: true });
  }

  async navigateBuddyListToChat(selectedChatUserName: string, selectedChatId: string, otherUserIdOfSelectedChat: string) {
    console.log('This chat ID was selected: ' + selectedChatId);
    //set the selected chat in the chat service, so the navigation will be selected accordingly.
    this.chatService.setSelectedOtherUserId = otherUserIdOfSelectedChat;
    this.chatService.setSelectedChatId = selectedChatId;
    this.chatService.setSelectedChatUserName = selectedChatUserName;
    this.router.navigateByUrl('tabs/gym-buddy/gb-chat', { replaceUrl: true });
  }

  public isNewChat(message: string) {
    if(message === 'Start chatting with this user.') {
      return true;
    } else {
      return false;
    }
  }

}
