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


//is it good practice to declare 2 classes in a single file? Usually in java we don't do that
//not sure about typescript's standards...
export class GymBuddyDetails{
    isSignUp: boolean;
}

