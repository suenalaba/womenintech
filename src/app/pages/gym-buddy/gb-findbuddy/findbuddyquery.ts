
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyService } from 'src/app/services/gym-buddy.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class FindBuddyQuery {
  dbRetrieve: DbRetrieveService
  gbService: GymBuddyService
  gender;
  preferredGender;
  currentUser:GymBuddyProfileInfo;
  constructor(private dbservice: DbRetrieveService,private gbservice: GymBuddyService, private currentuser:GymBuddyProfileInfo
  ) {
    this.dbRetrieve=dbservice;
    this.gbService=gbservice;
    this.currentUser=currentuser;
    this.gender=this.currentUser.getGender;
    this.preferredGender=this.currentUser.getPrefBuddyGender;
   }

  public addMatches(userID: string){
    this.currentUser.addMatches(userID);
    this.gbService.updateMatches(this.currentUser,userID);
  }

  public addUnmatches(userID: string){
    this.currentUser.addUnmatches(userID);
    this.gbService.updateUnmatches(this.currentUser,userID);
  }


  public async findBuddyQuery() {
    let dictofProfile =await  this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    return this.filterDictionary(dictofProfile);
  }

  private filterDictionary(dict:Map<string, GymBuddyProfileInfo>){
    this.currentUser.matches.forEach(function (value) {
      delete dict[value];
    });
    this.currentUser.unmatches.forEach(function (value) {
      delete dict[value];
    });
    return dict
  }
}
