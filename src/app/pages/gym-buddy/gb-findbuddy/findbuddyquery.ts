
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class FindBuddyQuery {

  //private dbRetrieve: DbRetrieveService;
  private dbRetrieve: DbRetrieveService;
  private currentUser: GymBuddyProfileInfo;
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

  public addMatches(userID: string){
    this.currentUser.addMatches(userID);
    this.dbRetrieve.updateMatches(this.currentUser,userID);
  }

  public addUnmatches(userID: string){
    this.currentUser.addUnmatches(userID);
    this.dbRetrieve.updateUnmatches(this.currentUser,userID);
  }


  public async findBuddyQuery() {
    const dictOfProfile = await this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    this.filterDictionary(dictOfProfile);
    return dictOfProfile;
  }

  private filterDictionary(dict:Map<string, GymBuddyProfileInfo>){
    this.currentUser.matches.forEach(function (value) {
      console.log(value);
      delete dict[value];
    });
    this.currentUser.unmatches.forEach(function (value) {
      delete dict[value];
    });
  }
}
