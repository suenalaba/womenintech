export class FindBuddyQuery {
  userInfo;
  preferredGender;

  findBuddyQuery() {
    this.settingFields();

  }
  private settingFields() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'));
    this.preferredGender = this.userInfo.gymBuddyDetails.buddyGender;
  }

  private async pullFromDB() {

  }

}
// IsSingup=True
// is buddygender
