export class GymBuddyProfileInfo {
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
  private gymBuddyInfo = this.userInfo.gymBuddyDetails;

  constructor() {
    this.briefIntro = this.gymBuddyInfo.briefIntro;
    this.workoutTimePreference = this.gymBuddyInfo.workoutTimePreference;
    this.buddyGender = this.gymBuddyInfo.buddyGender;
    this.gymBuddyGoals = this.gymBuddyInfo.gymBuddyGoals;
    this.personalTraits = this.gymBuddyInfo.personalTraits;
    this.personalTrainStyle = this.gymBuddyInfo.personalTrainStyle;
    this.locationPreference = this.gymBuddyInfo.locationPreference;
    this.buddyTraits = this.gymBuddyInfo.buddyTraits;
    this.buddyTrainStyle = this.gymBuddyInfo.buddyTrainStyle;
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

