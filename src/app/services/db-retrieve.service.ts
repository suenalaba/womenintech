import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData, doc, setDoc, docData } from '@angular/fire/firestore';
import { addDoc, arrayUnion, DocumentReference, DocumentSnapshot, getDoc, Query, updateDoc } from 'firebase/firestore';
import { query, where, getDocs,collectionGroup } from 'firebase/firestore';
import { GymBuddyProfileInfo } from '../pages/gym-buddy/gb-findbuddy/GymBuddyInformation';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class DbRetrieveService {

  private currentUserDataDoc: DocumentSnapshot<any>;

  constructor(
    private firestore: Firestore,
    private loadingController: LoadingController
    ) { }


  /**
   *
   * @param preferredGender User's preferred gender of the gym buddy.
   * @param gender User's gender.
   * @returns dictionary of gym buddy profiles that have matched that criteria
   */
  public async findBuddiesFromDB(preferredGender: string, gender: string){
    const usersDB = collection(this.firestore, 'Users'); //users collection in firestore
    const id = JSON.parse(localStorage.getItem('userID')); //get id string from localStorage
    let q: Query;
    //user has no preferred gender, meaning we fetch both Male and Female.
    if(preferredGender === 'no_preference') {
      //query for users that have signed up for gym buddy, and their preferred gender is no preference or of the user's preferred gender.
        q = query(usersDB, where('gymBuddyDetails.isSignUp', '==', true), //that user must have signed up for gym buddy
        where('gymBuddyDetails.buddyGender', 'in', ['no_preference', gender]), //that user's preferred buddy gender is no preference
        where('id', '!=', id)); //guard clause so you don't find yourself
        //or the user's gender.
    }
    else {
      q = query(usersDB, where('gymBuddyDetails.isSignUp', '==', true),
          where('gymBuddyDetails.buddyGender', 'in', ['no_preference', gender])); //For testing purposes if not enough samples
      /*q = query(usersDB, where('gymBuddyDetails.isSignUp', '==', true), //that user must have signed up for gym buddy
          where('gender', '==', preferredGender), //that user's gender is the preferredGender of me.
          where('gymBuddyDetails.buddyGender', 'in', ['no_preference', gender]), //that users preferred buddy gender, is me or no pref
          where('id', '!=', id)); //guard clause so you don't find yourself */
    }

    //query snapshot object
    const querySnapshot = await this.pullFromDB(q);

    const dictOfProfiles = new Map<string, GymBuddyProfileInfo>();
    console.log('Matched users: ');
    //loop through query snapshot, extract each document.
    querySnapshot.forEach((doc) => {
      //create a new gym buddy profile for each person that matches query.
      const person = new GymBuddyProfileInfo(doc.data());
      console.log('user id: ', person.getUserId);
      dictOfProfiles[doc.id] = person; //dictionary key: id, value: Gym Buddy Profile Info object.
      console.log(dictOfProfiles[doc.id]); //print the gym buddy profile.
    });
    return dictOfProfiles;
  }

  /**
   * Uses the current instance of the user info and store in a Gym Buddy Profile Object.
   *
   * @returns Gym Buddy Profile Object
   */
  public retrieveCurrentUser(): GymBuddyProfileInfo {
    const userInfo = new GymBuddyProfileInfo(this.currentUserDataDoc.data()); //create userInfo object which stores user data.
    return userInfo;
  }

  /**
   * Sets the current user in the home-page, so no need to constantly pull from DB.
   */
  public async setCurrentUser() {
    const loading = await this.loadingController.create();
    const id = JSON.parse(localStorage.getItem('userID')); //get id string from localStorage
    const ref = doc(this.firestore, 'Users', id); //object ref refers to information in the firebase
    const user = await this.singlePullFromDB(ref); //pull ref, and store in user object.
    this.currentUserDataDoc = user;
  }

  public updateMatches(user: GymBuddyProfileInfo,userID) {
    //console.log(details);
    const noteDocRef = doc(this.firestore, `Users`, user.getUserId);

    return updateDoc(noteDocRef,{ 'gymBuddyDetails.matches' : arrayUnion(userID)});
  }

  public updateUnMatches(user: GymBuddyProfileInfo,userID) {
    //console.log(details);
    const noteDocRef = doc(this.firestore, `Users`, user.getUserId);

    return updateDoc(noteDocRef,{ 'gymBuddyDetails.unmatches' : arrayUnion(userID)});
  }

  /**
   * Create a chat with both users.
   *
   * @param currentUserId Primary user id
   * @param recommendedUserId Secondary user id to create the chat with.
   */
  public async createChatInFireStore(currentUserId: string, recommendedUserId: string) {
    const newChatDoc = await addDoc(collection(this.firestore, 'Chat'), {
      chatUsers: [currentUserId, recommendedUserId]
    });
    const chatId = newChatDoc.id;
    console.log('Document written with ID: ', chatId);
    this.updateChatForEachUser(currentUserId, chatId, recommendedUserId);
  }

  /**
   * Updates the chat field in firestore for both users that matched.
   * The chat field in firestore stores an array of hashmaps.
   * Each hashmap K:V => ChatId: UserId of the other party in the chat.
   * => OtherUser: the userId of the other person in the chat.
   *
   * @param currentUserId User Id of Primary user.
   * @param chatId Chat Id of the chat between both parties.
   * @param recommendedUserId User Id of the buddy you matched with. (Secondary User).
   */
  private updateChatForEachUser(currentUserId: string, chatId: string, recommendedUserId: string) {
    const curUserDocRef = doc(this.firestore, `Users`, currentUserId);
    updateDoc(curUserDocRef, { 'gymBuddyDetails.chats': arrayUnion({chatID: chatId,
    otherUser: recommendedUserId})});
    const recUserDocRef = doc(this.firestore, `Users`, recommendedUserId);
    updateDoc(recUserDocRef, { 'gymBuddyDetails.chats': arrayUnion({chatID: chatId,
    otherUser: currentUserId})});
  }

  /**
   * Reads the document to be fetched and get the document snapshot with document contents.
   *
   * @param q reference of the document to fetch
   * @returns querySnapshot A Promise resolved with a querySnapshot containing the current document contents.
   */
  private async singlePullFromDB(q) {
    const querySnapshot = await getDoc(q);
    return querySnapshot;
  }

  /**
   * Returns promise as a query snapshot.
   *
   * @param q query object.
   * @returns gets all the docs matching the query.
   */
  private async pullFromDB(q) {
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  }




}
