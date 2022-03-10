
import { DbRetrieveService } from './../../services/db-retrieve.service';


export class FindBuddyQuery {
  dbRetrieve: DbRetrieveService
  userInfo;
  preferredGender;

  public findBuddyQuery() {
    this.settingFields();
    this.dbRetrieve.findBuddiesFromDB(this.preferredGender);
  }
  private settingFields() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.preferredGender = this.userInfo.gymBuddyDetails.buddyGender;
  }

}
// IsSingup=True
// is buddygender
