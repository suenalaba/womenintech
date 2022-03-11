import { userInfo } from "os";

export class GymBuddyProfileInfo {
  private userId: string;
  private isSignUp: boolean;
  private briefIntro?: string;
  //workoutTimePreference: string; //how to create an array to store an array of workouttimepreferences
  private workoutTimePreference?: string[];
  private buddyGender?: string;
  private gymBuddyGoals?: string[];
  private personalTraits?: string[];
  private personalTrainStyle?: string[];
  private locationPreference?: string[];
  private buddyTraits?: string[];
  private buddyTrainStyle?: string[];
  private userInfo = JSON.parse(localStorage.getItem('userInfo'));
  private gymBuddyInfo=this.userInfo.gymBuddyInfo;

  constructor(data) {
    this.userInfo=JSON.parse(JSON.stringify(data));
    this.userId = this.userInfo.id; //probably should use superclass for this.
    this.gymBuddyInfo=this.userInfo.gymBuddyDetails;
    this.briefIntro = this.userInfo.gymBuddyDetails.briefIntro;
    this.workoutTimePreference = this.userInfo.gymBuddyDetails.workoutTimePreference;
    this.buddyGender = this.userInfo.gymBuddyDetails.buddyGender;
    this.gymBuddyGoals = this.userInfo.gymBuddyDetails.gymBuddyGoals;
    this.personalTraits = this.userInfo.gymBuddyDetails.personalTraits;
    this.personalTrainStyle = this.userInfo.gymBuddyDetails.personalTrainStyle;
    this.locationPreference = this.userInfo.gymBuddyDetails.locationPreference;
    this.buddyTraits = this.userInfo.gymBuddyDetails.buddyTraits;
    this.buddyTrainStyle = this.userInfo.gymBuddyDetails.buddyTrainStyle;
  }



  public get getUserId(): string {
    return this.userId;
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

