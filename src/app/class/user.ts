import { GymBuddyDetails } from './GymBuddyProfile';

export class User {
    birthday: string;
    email: string;
    firstName: string;
    gender: string;
    gymBuddyDetails?: GymBuddyDetails;
    id: string;
    lastName: string;
    userDetails?: UserDetails;
    username: string;
}

export class UserDetails {
    areaOfInjury?: string;
    fitnessGoal: string;
    healthCond: string;
    healthCondName?: string;
    height: number;
    injury: string;
    injuryType?: string;
    menstruationCycle?: string;
    weight: number;
}
