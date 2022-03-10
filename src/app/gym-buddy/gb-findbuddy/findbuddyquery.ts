
import { DbRetrieveService } from './../../services/db-retrieve.service';


export class FindBuddyQuery {
  dbRetrieve: DbRetrieveService
  userInfo;
  gender;
  preferredGender;
  constructor(private service: DbRetrieveService
  ) {this.dbRetrieve=service; }

  public findBuddyQuery() {
    this.settingFields();
    this.dbRetrieve.findBuddiesFromDB(this.preferredGender,this.gender);
  }
  private settingFields() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.preferredGender = this.userInfo.gymBuddyDetails.buddyGender;
    this.gender=this.userInfo.gender;
  }

}
// IsSingup=True
// is buddygender
