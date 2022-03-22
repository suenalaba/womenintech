
import { DbRetrieveService } from './../../../services/db-retrieve.service';


export class FindBuddyQuery {
  dbRetrieve: DbRetrieveService
  gender;
  preferredGender;
  userInfo;
  constructor(private service: DbRetrieveService, private userGender : string, private userPreferredGender : string
  ) {this.dbRetrieve=service;
    this.gender=userGender;
    this.preferredGender=userPreferredGender
   }

  public async findBuddyQuery() {
    let arrayofProfile =await  this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    return arrayofProfile;
  }
}
