import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { addDoc, arrayUnion, DocumentReference, getDoc, Query, updateDoc } from 'firebase/firestore';
import { query, where, getDocs,collectionGroup } from 'firebase/firestore';
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';
import { AlertController, LoadingController } from '@ionic/angular';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GbFindbuddyPage } from '../pages/gym-buddy/gb-findbuddy/gb-findbuddy.page';
import { type } from 'os';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  //key:other user name, value: latest message
  //private allChatNameAndMessage: Map<string, string>;
  //private allChatIds: Map<string, string>[] = [];
  //contains an array of chat ids and user ids of secondary party in the chat
  private allChatIds;
  private userDataAsDoc = null;
  private conversationData;
  private otherUserData;
  //private testDoc = null;
  private selectedChatId: string = null;
  private selectedChatUserName: string = null;
  private currentUser: GymBuddyProfileInfo = null;
  constructor(private fireStore: Firestore, private loadingController: LoadingController) {
    /*this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });*/
  }

  public get getSelectedChatUserName() {
    return this.selectedChatUserName;
  }

  public get getSelectedChatId() {
    return this.selectedChatId;
  }

  public set setSelectedChatUserName(userName: string) {
    this.selectedChatUserName = userName;
  }

  public set setSelectedChatId(chatId: string) {
    this.selectedChatId = chatId;
  }



  //currentUser: User = null;

  /**
   * Fetches User ID from local storage, then gets the user info and store in a Gym Buddy Profile Object.
   *
   * @returns Gym Buddy Profile Object
   */
   public async retrieveCurrentChatUser(): Promise<GymBuddyProfileInfo> {
    const loading = await this.loadingController.create();
    const id = JSON.parse(localStorage.getItem('userID')); //get id string from localStorage
    const ref = doc(this.fireStore, 'Users', id); //object ref refers to information in the firebase
    const user = await this.getCurrentUserInfoFromDB(ref); //pull ref, and store in user object.
    this.userDataAsDoc = user;
    const userInfo = new GymBuddyProfileInfo(user.data()); //create userInfo object which stores user data.
    this.currentUser = userInfo;
    return userInfo;
  }

  /**
   * Gets an array of hashmap for all the chats involving the current user.
   * The map contains the chat id and the id of the other user in the chat.
   */
  public async retrieveAllChatsFromDB(): Promise<string[]> {
    const loading = await this.loadingController.create();
    //const curUserDocRef = doc(this.fireStore,`Users`,curUserId);
    //const chatArray = await this.getAllChatIdFromDb(curUserDocRef);
    //console.log(this.userDataAsDoc.data());
    this.allChatIds = this.userDataAsDoc.data().gymBuddyDetails.chats;
    //console.log(this.allChatIds);
    const allChatInfo = this.allChatIds;
    //console.log(typeof(this.allChatIds));
    return allChatInfo;
  }
  /**
   * Gets all the Buddy Name and Last Messages of all the chat involving the primary user.
   *
   * @returns Map of K:V pair containing BuddyName : Last Message
   */
  public async getGbListHomeDisplayFromDB() {
    //this.allChatNameAndMessage.clear();
    const allChatNameAndMessage = new Map<string, string[]>();
    const chatInfoArray = this.allChatIds;
    for (const chatInfo of chatInfoArray) {
      //console.log(chatInfo.chatID);
      const chatRef = doc(this.fireStore, 'Chat', chatInfo.chatID);
      const conversationDoc = await this.pullFullChat(chatRef);
      this.conversationData = conversationDoc.data();
      const lastMessage = this.conversationData.conversation[0].message;
      console.log(lastMessage);
      //console.log(conversationData);
      console.log(chatInfo.otherUser);
      const otherUserRef = doc(this.fireStore, 'Users', chatInfo.otherUser);
      const otherUserDoc = await this.getOtherUser(otherUserRef);
      this.otherUserData = otherUserDoc.data();
      const firstName = this.otherUserData.firstName;
      const lastName = this.otherUserData.lastName;
      const fullName = firstName + lastName;
      console.log(fullName);
      allChatNameAndMessage.set(fullName, [lastMessage,chatInfo.chatID]);
      //const mapofnameandmessage = this.allChatNameAndMessage;
      //mapofnameandmessage.set(fullName, lastMessage);
    }
    return allChatNameAndMessage;
  }

  private async getOtherUser(q) {
    const otherUserQuerySnapshot = await getDoc(q);
    return otherUserQuerySnapshot;
  }

  private async pullFullChat(q) {
    const chatQuerySnapshot = await getDoc(q);
    return chatQuerySnapshot;
  }

  /*public async testPullFromDb() {
    const testref = doc(this.fireStore, 'Chat','Test');
    const docinfo = await this.getCurrentUserInfoFromDB(testref);
    this.testDoc = docinfo;
    const info = this.testDoc.data().favorites;
    const infoarray = info;
    console.log(infoarray[0].subject);
  }*/

  /**
   * Reads the document to be fetched and get the document snapshot with document contents.
   *
   * @param q reference of the document to fetch
   * @returns querySnapshot A Promise resolved with a querySnapshot containing the current document contents.
   */
   private async getCurrentUserInfoFromDB(q) {
    const querySnapshot = await getDoc(q);
    return querySnapshot;
  }

  private async getAllChatIdFromDb(q) {
    const querySnapshot = await getDoc(q);
    return querySnapshot;
  }



  /*public async retrieveAllChats()


export interface Message {
  //createdDate: Firestore.FieldValue;
  //createdAt: firebase.firestore.FieldValue;
  id: string;
  from: string;
  msg: string;
  fromName: string;
  myMsg: boolean;
}

// Chat functionality

addChatMessage(msg) {
  const chatDocRef = await updateDoc(this.firestore, 'Chat',)
  return this.afs.collection('messages').add({
    msg: msg,
    from: this.currentUser.uid,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
}

getChatMessages() {
  let users = [];
  return this.getUsers().pipe(
    switchMap(res => {
      users = res;
      return this.afs.collection('messages', ref => ref.orderBy('createdAt')).valueChanges({ idField: 'id' }) as Observable<Message[]>;
    }),
    map(messages => {
      // Get the real name for each user
      for (let m of messages) {
        m.fromName = this.getUserForMsg(m.from, users);
        m.myMsg = this.currentUser.uid === m.from;
      }
      return messages
    })
  )
}

private getUsers() {
  return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
}

private getUserForMsg(msgFromId, users: User[]): string {
  for (let usr of users) {
    if (usr.uid == msgFromId) {
      return usr.email;
    }
  }
  return 'Deleted';*/
}
