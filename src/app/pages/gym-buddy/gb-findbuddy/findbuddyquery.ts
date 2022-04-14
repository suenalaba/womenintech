
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class FindBuddyQuery {

  
  private currentUser: GymBuddyProfileInfo;
//private dbRetrieve: DbRetrieveService;
  private dbRetrieve: DbRetrieveService;
  private gender;
  private preferredGender;
  //private currentUser: GymBuddyProfileInfo;
  constructor(dbRetrieve: DbRetrieveService, currentUser: GymBuddyProfileInfo) {
    this.dbRetrieve = dbRetrieve;
    this.currentUser = currentUser;
    //this.dbRetrieve=dbservice;
    //this.currentUser=currentuser;
    this.gender=this.currentUser.getGender;
    this.preferredGender=this.currentUser.getPrefBuddyGender;
  }

  public createChatQuery(currentUserId: string, recommendedUserId: string) {
    //locally add chat here.
    this.dbRetrieve.createChatInFireStore(currentUserId, recommendedUserId);
  }

  public addMatches(userID: string){
    console.log("reach here");
    this.currentUser.addMatches(userID);
    console.log("reach here2");
    this.dbRetrieve.updateMatches(this.currentUser,userID);
  }

  public addUnmatches(userID: string){
    this.currentUser.addUnmatches(userID);
    this.dbRetrieve.updateUnMatches(this.currentUser,userID);
  }


  public async findBuddyQuery() {
    const dictOfProfile = await this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    this.filterDictionary(dictOfProfile);
    return dictOfProfile;
  }

  private filterDictionary(dict: Map<string, GymBuddyProfileInfo>){
    this.currentUser.matches.forEach(function(value) {
      console.log(value);
      delete dict[value];
    });
    this.currentUser.unmatches.forEach(function(value) {
      delete dict[value];
    });
  }
}
