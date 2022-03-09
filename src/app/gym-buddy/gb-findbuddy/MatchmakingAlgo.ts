import { GymBuddyProfileInfo } from './GymBuddyInformation';

class MatchmakingAlgo {

  private static readonly TIME_AND_LOC_PREF_WEIGHTAGE = 10/100;
  private static readonly GOALS_WEIGHTAGE = 20/100;
  private static readonly EXPERTISE_AND_STYLE_WEIGHTAGE = 60/100;
  private static readonly FIVE_SELECTIONS = 5;
  private static readonly TWO_SELECTIONS = 2;
  private static readonly THREE_SELECTIONS = 3;
  private static readonly TRAITS_AND_STYLE_SELECTIONS = 10;
  /* Record<userid, matchscore>*/
  private myVar: Record<string, number> = {
    //key1: 'val1',
    //key2: 'val2',
 };

  constructor() {

  }

  public calculateMatchingScore() {
    const currentUser = new GymBuddyProfileInfo();
    const anotherUser = new GymBuddyProfileInfo();
    const matchScore = this.getTotalMatchScore(currentUser, anotherUser);
  }




  private getTotalMatchScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let matchScore = 0;
    const timeScore = this.getTimePrefScore(currentUser, anotherUser);
    const goalsScore = this.getGoalsScore(currentUser, anotherUser);
    const traitsStyleScore = this.getTraitsAndStyleScore(currentUser, anotherUser);
    const locationScore = this.getLocationPrefScore(currentUser, anotherUser);
    //tabulate scores
    matchScore = locationScore + traitsStyleScore + goalsScore + timeScore;
    return matchScore;
  }

  private getLocationPrefScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let locationScore = 0;
    for (const field of currentUser.getLocationPreference) {
      if (anotherUser.getLocationPreference.includes(field)) {
        locationScore++;
      }
    }
    locationScore = locationScore / MatchmakingAlgo.TWO_SELECTIONS * MatchmakingAlgo.TIME_AND_LOC_PREF_WEIGHTAGE;
    return locationScore;
  }

  private getTraitsAndStyleScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let traitsStyleScore = 0;
    /* user A personal traits match with user B preferred traits */
    for (const field of currentUser.getPersonalTraits) {
      if (anotherUser.getBuddyTraits.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A personal trainstyle match with User B preferred train style */
    for (const field of currentUser.getPersonalTrainStyle) {
      if (anotherUser.getBuddyTrainStyle.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A preferred buddy traits match with User B's personal traits*/
    for (const field of currentUser.getBuddyTraits) {
      if (anotherUser.getPersonalTraits.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A preferred buddy train styles match with User B's personal train style */
    for (const field of currentUser.getBuddyTrainStyle) {
      if (anotherUser.getPersonalTrainStyle.includes(field)) {
        traitsStyleScore++;
      }
    }
    traitsStyleScore = traitsStyleScore / MatchmakingAlgo.TRAITS_AND_STYLE_SELECTIONS * MatchmakingAlgo.EXPERTISE_AND_STYLE_WEIGHTAGE;
    return traitsStyleScore;
  }

  private getGoalsScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let goalsScore = 0;
    for (const field of currentUser.getGymBuddyGoals) {
      if (anotherUser.getGymBuddyGoals.includes(field)) {
        goalsScore++;
      }
    }
    goalsScore = goalsScore / MatchmakingAlgo.THREE_SELECTIONS * MatchmakingAlgo.GOALS_WEIGHTAGE;
    return goalsScore;
  }

  private getTimePrefScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let timeScore = 0;
    /* field refers to array entry */
    for (const field of currentUser.getWorkoutTimePreference) {
      if (anotherUser.getWorkoutTimePreference.includes(field)) {
        timeScore++;
      }
    }
    timeScore = timeScore / MatchmakingAlgo.FIVE_SELECTIONS * MatchmakingAlgo.TIME_AND_LOC_PREF_WEIGHTAGE;
    return timeScore;
  }
}
