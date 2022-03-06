import { buddyGender } from "../data/gym-buddy-data/BuddyGender";
import { GymBuddyDetails } from "../data/gym-buddy-data/GymBuddyDetails";

export class User {
  email: string;
  firstName: string;
  lastName: string;
  id: string;
  gender: string;
  birthday: string;
  username: string;
}

export class UserDetails {
  height: number;
  weight: number;
  injury: string;
  healthCond: string;
  areaOfInjury?: string;
  injuryType?: string;
  healthCondName?: string;
  fitnessGoal: string;
  menstruationCycle?: string;
}

//choose get fit , lift heavier
class GymBuddyProfile extends UserDetails {
  briefIntro: string;
  //workoutTimePreference: string; //how to create an array to store an array of workouttimepreferences
  workoutTimePreference: string[];
  buddyGender: string;
  gymBuddyGoals: string;
  personalTraits: string;
  personalTrainStyle: string;
  locationPreference: string;
  buddyTraits: string;
  buddyTrainStyle: string;
}

type Userinfo = {
  id: number;
  name: string;
};

const user: Userinfo = {
  id: 1,
  name: 'James'
};
