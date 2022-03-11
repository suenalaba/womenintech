
import { DbRetrieveService } from './../../../services/db-retrieve.service';


export class FindBuddyQuery {
  dbRetrieve: DbRetrieveService
  userInfo;
  gender;
  preferredGender;
  constructor(private service: DbRetrieveService
  ) {this.dbRetrieve=service; }

  public async findBuddyQuery() {
    this.settingFields();
    console.log("test1");
    const arrayofProfile=await  this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
    console.log("test2");
    return arrayofProfile;
  }
  private settingFields() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.preferredGender = this.userInfo.gymBuddyDetails.buddyGender;
    this.gender=this.userInfo.gender;
  }

}
// IsSingup=True
// is buddygender
