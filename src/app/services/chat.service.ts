import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData, onSnapshot, deleteDoc } from '@angular/fire/firestore';
import { addDoc, arrayUnion, DocumentReference, getDoc, Query, updateDoc,
  Timestamp, serverTimestamp, DocumentSnapshot, arrayRemove } from 'firebase/firestore';
import { query, where, getDocs,collectionGroup } from 'firebase/firestore';
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';
import { AlertController, LoadingController } from '@ionic/angular';
import { switchMap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GbFindbuddyPage } from '../pages/gym-buddy/gb-findbuddy/gb-findbuddy.page';

@Injectable({
  providedIn: 'root'
})

export class ChatService {



  // myObservable = new Observable ((observer) => {
  //   const unSub = onSnapshot(doc(this.fireStore, 'Chat', this.selectedChatId), (chatDoc) => {
  //     const source = chatDoc.metadata.hasPendingWrites ? 'Local' : 'Server';
  //     console.log(chatDoc.data);
  //     //const nextInfo = source + 'data: ' + chatDoc.data();
  //     //observer.next(nextInfo);
  //     console.log(source, ' data: ', chatDoc.data());
  //     observer.next(chatDoc.data().conversation);
  //   });
  //   console.log('Observable starts');
  //   // setTimeout(()=>{observer.next('1');},1000);
  //   // setTimeout(()=>{observer.next('2');},2000);
  //   // setTimeout(()=>{observer.next('3');},3000);
  //   // setTimeout(()=>{observer.next('4');},4000);
  //   // setTimeout(()=>{observer.next('5');},5000);
  // });



  //key:other user name, value: latest message
  //private allChatNameAndMessage: Map<string, string>;
  //private allChatIds: Map<string, string>[] = [];
  //contains an array of chat ids and user ids of secondary party in the chat
  private allChatIds;
  private userDataAsDoc = null;
  private conversationData;
  private otherUserData;
  //private testDoc = null;
  //these fields are set based on which chat was selected.
  private selectedChatId: string = null;
  private selectedChatUserName: string = null; //username of the other party.
  private selectedOtherUserId: string = null;
  private selectedOtherUserProfilePicture: string = null;

  private currentUser: GymBuddyProfileInfo = null;
  constructor(private fireStore: Firestore, private loadingController: LoadingController) {
    /*this.afAuth.onAuthStateChanged((user) => {
      this.currentUser = user;
    });*/
  }

  public get getSelectedOtherUserProfilePicture() {
    return this.selectedOtherUserProfilePicture;
  }

  public get getCurrentUser() {
    return this.currentUser;
  }

  public get getSelectedOtherUserId() {
    return this.selectedOtherUserId;
  }

  public get getSelectedChatUserName() {
    return this.selectedChatUserName;
  }

  public get getSelectedChatId() {
    return this.selectedChatId;
  }

  public set setSelectedOtherUserProfilePicture(profilePicture: string) {
    this.selectedOtherUserProfilePicture = profilePicture;
  }

  public set setSelectedChatUserName(userName: string) {
    this.selectedChatUserName = userName;
  }

  public set setSelectedChatId(chatId: string) {
    this.selectedChatId = chatId;
  }

  public set setSelectedOtherUserId(otherUserId: string) {
    this.selectedOtherUserId = otherUserId;
  }


  /**
   * Observable that updates whenever data in the database changes.
   *
   * @returns the most updated conversation data
   */
   public getAllChatMessages() {

    return new Observable(observer => {
      const unSub = onSnapshot(doc(this.fireStore, 'Chat', this.selectedChatId), (chatDoc) => {
        const source = chatDoc.metadata.hasPendingWrites ? 'Local' : 'Server';

          observer.next(chatDoc.data().conversation);
        });

      return () => {
        unSub();
      };
    });
  }

  //Chat functionalities
  public addChatMessage(msg) {
    const chatSelectedRef = doc(this.fireStore, 'Chat', this.selectedChatId);
    const messageData = {
      fromId: this.currentUser.getUserId,
      isRead: false,
      message: msg,
      timeSent: Timestamp.now()
    };
    return updateDoc(chatSelectedRef, {conversation: arrayUnion(messageData)});
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
      let lastMessage = '';
      let timeDiffString = '';
      try {
        //should be -1 to index the last message, but idk why its not working.
        const conversationArr = this.conversationData.conversation;
        timeDiffString = this.getTimeDiffInString(conversationArr, timeDiffString);
        console.log('The conversation is: ', conversationArr);
        lastMessage = conversationArr[conversationArr.length - 1].message;
        console.log('LastMessage is:', lastMessage);
      } catch (error) {
        //if conversation has not started.
        lastMessage = 'Start chatting with this user.';
        timeDiffString = '';
      }
      //console.log(conversationData);
      console.log(chatInfo.otherUser);
      const otherUserRef = doc(this.fireStore, 'Users', chatInfo.otherUser);
      const otherUserDoc = await this.getOtherUser(otherUserRef);
      this.otherUserData = otherUserDoc.data();
      const firstName = this.otherUserData.firstName;
      const lastName = this.otherUserData.lastName;
      const fullName = firstName + lastName;
      console.log(fullName);
      const profilePicture = this.otherUserData.gymBuddyDetails.profilePicture;
      //full name, last message, chat id, other userId.
      allChatNameAndMessage.set(fullName, [lastMessage,chatInfo.chatID,this.otherUserData.id,timeDiffString,profilePicture]);
      //const mapofnameandmessage = this.allChatNameAndMessage;
      //mapofnameandmessage.set(fullName, lastMessage);
    }
    return allChatNameAndMessage;
  }

  public async deleteMatch(chatId: string, currentUserId: string, otherUserId: string) {
    //remove chat reference for both users. 'chats' field array being edited.
    await this.removeChatReferenceFromBothUsers(chatId, currentUserId, otherUserId);
    //delete the chat
    await deleteDoc(doc(this.fireStore, 'Chat', chatId));
    //move matches to unMatches for current user.
    await this.moveMatchesToUnMatchesForCurrentUser(currentUserId, otherUserId);
    //move matches to unMatches for other user.
    await this.moveMatchesToUnMatchesForOtherUser(currentUserId,otherUserId);
  }

  public async moveMatchesToUnMatchesForCurrentUser(currentUserId: string, otherUserId: string) {
    //get current user document reference
    const currentUserDocRef = doc(this.fireStore, `Users`, currentUserId);
    //remove the the buddy from matches
    await updateDoc(currentUserDocRef,{ 'gymBuddyDetails.matches' : arrayRemove(otherUserId)});
    //add the buddy to unMatches
    await updateDoc(currentUserDocRef,{ 'gymBuddyDetails.unmatches' : arrayUnion(otherUserId)});
  }

  public async moveMatchesToUnMatchesForOtherUser(currentUserId: string, otherUserId: string) {
    //get other user document reference
    const otherUserDocRef = doc(this.fireStore, `Users`, otherUserId);
    //remove the current user from matches
    await updateDoc(otherUserDocRef,{ 'gymBuddyDetails.matches' : arrayRemove(currentUserId)});
    //add the current user to unMatches
    await updateDoc(otherUserDocRef,{ 'gymBuddyDetails.unmatches' : arrayUnion(currentUserId)});
  }

  public async removeChatReferenceFromBothUsers(chatId: string, currentUserId: string, otherUserId: string) {
    //get current user document reference
    const currentUserDocRef = doc(this.fireStore, `Users`, currentUserId);
    //update the chats field for current user, to remove the specific chatId.
    await updateDoc(currentUserDocRef, {'gymBuddyDetails.chats' : arrayRemove({chatID: chatId,
      otherUser: otherUserId})});
    //get other user document reference
    const otherUserDocRef = doc(this.fireStore, `Users`, otherUserId);
    //update the chats field for other user, to remove the specific chatId.
    await updateDoc(otherUserDocRef, {'gymBuddyDetails.chats' : arrayRemove({chatID: chatId,
      otherUser: currentUserId})});
    console.log('removed');
  }

  public async shareWorkout(currentUserId: string, otherUserId: string) {
    //array of existing workouts the other user already has.
    const existingWorkoutIds: string[] = [];
    //const workoutsToBeAdded = [];
    console.log('Sharing workout...');
    //const workoutRefDoc = doc(this.fireStore, `Users`, currentUserId, `Workouts`);
    //console.log('Workout List', workoutRefDoc);
    // const q = query(collection(this.fireStore, `Users`, currentUserId,`Workouts`), where('id', 'not-in',
    //     ['1648458669']));
    //query all the workout documents the other user already has.
    const q = query(collection(this.fireStore, `Users`, otherUserId,`Workouts`));
    const querySnapshotOfOthersWorkouts = await getDocs(q);
    querySnapshotOfOthersWorkouts.forEach((otherDoc) => {
    //doc.data() is never undefined for query doc snapshots
      console.log(otherDoc.id, ' => ', otherDoc.data());
      //store existing ids of workouts the other user already have so there won't be duplication.
      existingWorkoutIds.push(otherDoc.id);
    });
    console.log('Workouts have been checked');
    //now add workout docs where the document id does not exist in the array
    //query the existing workouts for the current user.
    const q2 = query(collection(this.fireStore, `Users`, currentUserId,`Workouts`));
    console.log('pass1');
    const querySnapshotOfMyWorkouts = await getDocs(q2);
    console.log('pass2');
    querySnapshotOfMyWorkouts.forEach(async (myDoc) => {
      console.log(myDoc.id, ' => ', myDoc.data());
      if (!existingWorkoutIds.includes(myDoc.id)) {
        console.log(myDoc.id);
        console.log(myDoc.data().wDescription);
        const tempDescription=myDoc.data().wDescription +'\n           Created By: '+ this.currentUser.name;
        console.log('temp description:',tempDescription);
        const tempDoc = JSON.parse(JSON.stringify(myDoc.data()));
        tempDoc.wDescription=tempDescription;
        console.log('After change: ', tempDoc);
        //if the existing workouts of the other user does not contain the workout I have, then add.
        //workoutsToBeAdded.push(document.data());
        const timestamp = Timestamp.fromDate(new Date());
        await setDoc(doc(this.fireStore, 'Users', otherUserId, 'Workouts', myDoc.id), tempDoc);
      }
    });
    console.log('Workouts to be added have been added! ');

    //now add workouts to be added as a new document.
  }


  private getTimeDiffInString(conversationArr: any, timeDiffString: string) {
    const lastTimeStamp = conversationArr[conversationArr.length - 1].timeSent.toDate().getTime();
    console.log(lastTimeStamp);
    const timeNow = new Date().getTime();
    const timeDiffInMillisecond = (timeNow - lastTimeStamp);
    console.log(timeDiffInMillisecond);
    timeDiffString = this.timeConversion(timeDiffInMillisecond);
    return timeDiffString;
  }


  /**
   * Convert from milliseconds to HH:MM:SS format.
   *
   * @param duration duration in milliseconds
   * @returns string in the format of HH:MM:SS
   */
  private timeConversion(duration: number): string {
    const portions: string[] = [];

    const msInHour = 1000 * 60 * 60;
    const hours = Math.trunc(duration / msInHour);
    if (hours > 0) {
      portions.push(hours + 'h');
      duration = duration - (hours * msInHour);
    }

    const msInMinute = 1000 * 60;
    const minutes = Math.trunc(duration / msInMinute);
    if (minutes > 0) {
      portions.push(minutes + 'm');
      duration = duration - (minutes * msInMinute);
    }

    const seconds = Math.trunc(duration / 1000);
    if (seconds > 0) {
      portions.push(seconds + 's');
    }

    return portions.join(' ');
  }


  // private getUsers() {
  //   return this.afs.collection('users').valueChanges({ idField: 'uid' }) as Observable<User[]>;
  // }

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

export interface Message {
  //createdDate: Firestore.FieldValue;
  //createdAt: firebase.firestore.FieldValue;
  chatId: string;
  fromId: string;
  message: string;
  fromName: string;
  isMyMsg: boolean; //indicates whether message was sent by me, primary user.
  isRead: boolean;
}
