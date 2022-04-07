
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class FindBuddyQuery {
  dbRetrieve: DbRetrieveService
  gbService: GymBuddyService
  gender;
  preferredGender;
  currentUser:GymBuddyProfileInfo;
  constructor(private dbservice: DbRetrieveService, private currentuser:GymBuddyProfileInfo
  ) {
    this.dbRetrieve=dbservice;
    this.currentUser=currentuser;
    this.gender=this.currentUser.getGender;
    this.preferredGender=this.currentUser.getPrefBuddyGender;
   }

  public addMatches(userID: string){
    this.currentUser.addMatches(userID);
    this.dbservice.updateMatches(this.currentUser,userID);
  }

  public addUnmatches(userID: string){
    this.currentUser.addUnmatches(userID);
    this.dbservice.updateUnmatches(this.currentUser,userID);
  }


  public async findBuddyQuery() {
    let dictofProfile =await  this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    this.filterDictionary(dictofProfile)
    return dictofProfile;
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
