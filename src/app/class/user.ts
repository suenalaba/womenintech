import { GymBuddyDetails } from './GymBuddyProfile';

export class User {
    email: string;
    firstName: string;
    lastName: string;
    id: string;
    gender: string;
    birthday: string;
    username: string;
    gymBuddyDetails?: GymBuddyDetails;
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
