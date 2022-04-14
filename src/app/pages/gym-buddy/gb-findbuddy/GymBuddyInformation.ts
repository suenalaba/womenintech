/* eslint-disable no-underscore-dangle */

export class GymBuddyProfileInfo {
  private _age='20';
  private _chats?: string[];
  private _isSignUp: boolean;
  private _matches?: string[];
  private userId: string;

  //workoutTimePreference: string; //how to create an array to store an array of workouttimepreferences
  private workoutTimePreference?: string[];
  private gender?: string;
  private buddyGender?: string;
  private gymBuddyGoals?: string[];
  private personalTraits?: string[];
  private personalTrainStyle?: string[];
  private locationPreference?: string[];
  private buddyTraits?: string[];
  private buddyTrainStyle?: string[];
  private userInfo;
  private gymBuddyInfo;
  private _unmatches?: string[];
  //To display
  private _name: string;
  private briefIntro?: string;
  private _profilePicture?: string;




  constructor(data) {
    this.userInfo=JSON.parse(JSON.stringify(data));

    // Information needed for matching
    this.userId = this.userInfo.id;
    this.gender=this.userInfo.gender;
    this.gymBuddyInfo=this.userInfo.gymBuddyDetails;
    this._isSignUp=this.userInfo.gymBuddyDetails.isSignUp;
    this.workoutTimePreference = this.userInfo.gymBuddyDetails.workoutTimePreference;
    this.buddyGender = this.userInfo.gymBuddyDetails.buddyGender;
    this.gymBuddyGoals = this.userInfo.gymBuddyDetails.gymBuddyGoals;
    this.personalTraits = this.userInfo.gymBuddyDetails.personalTraits;
    this.personalTrainStyle = this.userInfo.gymBuddyDetails.personalTrainStyle;
    this.locationPreference = this.userInfo.gymBuddyDetails.locationPreference;
    this.buddyTraits = this.userInfo.gymBuddyDetails.buddyTraits;
    this.buddyTrainStyle = this.userInfo.gymBuddyDetails.buddyTrainStyle;
    if(!this.userInfo.gymBuddyDetails.matches) {this.matches=[];}
      else {this.matches = this.userInfo.gymBuddyDetails.matches;}
    if(!this.userInfo.gymBuddyDetails.unmatches) {this.unmatches=[];}
      else {this.unmatches = this.userInfo.gymBuddyDetails.unmatches;}
    if(!this.userInfo.gymBuddyDetails.chats) {this.chats=[];}
      else {this.chats = this.userInfo.gymBuddyDetails.chats;}

    //Information needed for display
    // const birthday=new Date(this.userInfo.birthday);
    const birthday = Date.parse(this.userInfo.birthday);
    const today = new Date().getTime();
    const totalAgeInMilliseconds = today - birthday;
    this._age = String(Math.floor(totalAgeInMilliseconds / 31536000000));
    // const d1Y = birthday.getFullYear();
    // const d2Y = today.getFullYear();
    // const d1M = birthday.getMonth();
    // const d2M = today.getMonth();
    // const months=((d2M+12*d2Y)-(d1M+12*d1Y))/12;

    this._name=this.userInfo.firstName+' '+ this.userInfo.lastName;
    this.briefIntro = this.userInfo.gymBuddyDetails.briefIntro;
    // this._age=String(Math.floor(months));
    this._profilePicture=this.userInfo.gymBuddyDetails.profilePicture;
  }

  public get getUserId(): string {
    return this.userId;
  }

  public get getGender(): string {
    return this.gender;
  }

  public get getbriefIntro(): string {
    return this.briefIntro;
  }

  public get getPrefBuddyGender(): string {
    return this.buddyGender;
  }

  public get getPersonalTrainStyle(): string[] {
    return this.personalTrainStyle;
  }

  public get getBuddyTraits(): string[] {
    return this.buddyTraits;
  }

  public get getBuddyTrainStyle(): string[] {
    return this.buddyTrainStyle;
  }

  public get getLocationPreference(): string[] {
    return this.locationPreference;
  }

  public get getPersonalTraits(): string[] {
    return this.personalTraits;
  }

  public get getWorkoutTimePreference(): string[] {
    return this.workoutTimePreference;
  }

  public get getGymBuddyGoals(): string[] {
    return this.gymBuddyGoals;
  }
  public get name(): string {
    return this._name;
  }

  public get age(): string {
    return this._age;
  }
  public get profilePicture(): string {
    return this._profilePicture;
  }
  public get isSignUp(): boolean {
    return this._isSignUp;
  }

  public get matches(): string[] {
    return this._matches;
  }
  public get chats(): string[] {
    return this._chats;
  }
  public get unmatches(): string[] {
    return this._unmatches;
  }
  public set matches(value: string[]) {
    this._matches = value;
  }

  public set setbriefIntro(briefintro: string) {
    this.briefIntro = briefintro;
  }

  public set setPrefBuddyGender(gender: string) {
    this.buddyGender = gender;
  }

  public set isSignUp(value: boolean) {
    this._isSignUp = value;
  }
  public set unmatches(value: string[]) {
    this._unmatches = value;
  }
  public set chats(value: string[]) {
    this._chats = value;
  }

  /**
   *Adds new matches to the list of matches
   *
   *  @param value
   */
  public addMatches(value: string) {
    this._matches .push(value);
  }
  /**
   *Adds new unmatches to the list of unmatches
   *
   *  @param value
   */
  public addUnmatches(value: string) {
    this._unmatches .push(value);
  }

  /**
   *Checks if recommended user has matched with current user
   *
   *  @param userID
   * @returns if match is present
   */
  public checkMatches(userID: string): boolean{
    return this.matches.includes(userID);
  }
}

