import { userInfo } from "os";

export class GymBuddyProfileInfo {
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

  private _matches?: string[];
  private _unmatches?: string[];

  //To display
  private _name: string;
  private briefIntro?: string;
  private _age: string;
  private _profilePicture?: string;




  constructor(data) {
    this.userInfo=JSON.parse(JSON.stringify(data));
    // Information needed for matching
    this.userId = this.userInfo.id;
    this.gender=this.userInfo.gender;
    this.gymBuddyInfo=this.userInfo.gymBuddyDetails;
    this.workoutTimePreference = this.userInfo.gymBuddyDetails.workoutTimePreference;
    this.buddyGender = this.userInfo.gymBuddyDetails.buddyGender;
    this.gymBuddyGoals = this.userInfo.gymBuddyDetails.gymBuddyGoals;
    this.personalTraits = this.userInfo.gymBuddyDetails.personalTraits;
    this.personalTrainStyle = this.userInfo.gymBuddyDetails.personalTrainStyle;
    this.locationPreference = this.userInfo.gymBuddyDetails.locationPreference;
    this.buddyTraits = this.userInfo.gymBuddyDetails.buddyTraits;
    this.buddyTrainStyle = this.userInfo.gymBuddyDetails.buddyTrainStyle;

    this.matches = this.userInfo.gymBuddyDetails.matches;
    this.unmatches = this.userInfo.gymBuddyDetails.matches;

    //Information needed for display

    this._name=this.userInfo.firstName+" "+ this.userInfo.lastName;
    this.briefIntro = this.userInfo.gymBuddyDetails.briefIntro;
    this._age=this.userInfo.age;
    this._profilePicture="https://media-exp1.licdn.com/dms/image/C5603AQF9ARlKu4OEnQ/profile-displayphoto-shrink_800_800/0/1645845891083?e=1654128000&v=beta&t=XZy_KCUHo-LgpdfjL1LWmQ18jOfv_IGtr1pKskaCBhA"
    //this._profilePicture=this.userInfo.profilePicture;

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

  public set setbriefIntro(briefintro: string) {
    this.briefIntro = briefintro;
  }

  public set setPrefBuddyGender(gender: string) {
    this.buddyGender = gender;
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

  public get matches(): string[] {
    return this._matches;
  }
  public set matches(value: string[]) {
    this._matches = value;
  }
  public addMatches(value: string) {
    this._matches .push(value);
  }

  public get unmatches(): string[] {
    return this._unmatches;
  }
  public set unmatches(value: string[]) {
    this._unmatches = value;
  }
  public addUnmatches(value: string) {
    this._unmatches .push(value);
  }

  //not sure what is a better design, update individually, or take array as a parameter
  /* 1st parameter is the array to update */
  /* 2nd parameter is the information to update */
  public updateGymBuddyArrays(arr: string[], element: string) {
    arr.push(element);
  }

  public removeFromGymBuddyArrays(arr: string[], element: string) {
    const index = arr.indexOf(element);
    if (index > -1) {
      arr.splice(index,1);
    }
  }
}

