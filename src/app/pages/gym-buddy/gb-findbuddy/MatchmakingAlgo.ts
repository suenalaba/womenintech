/* eslint-disable @typescript-eslint/naming-convention */
import { GymBuddyProfileInfo } from './GymBuddyInformation';

/**
 * This control class calculates the score between the current user and each other,
 * the main logic of the Matchmaking Algorithm of the application.
 */
export class MatchmakingAlgo {
  private static readonly EXPERTISE_AND_STYLE_WEIGHTAGE = 60;
  private static readonly FIVE_SELECTIONS = 5;
  private static readonly GOALS_WEIGHTAGE = 20;
  private static readonly THREE_SELECTIONS = 3;
  private static readonly TIME_AND_LOC_PREF_WEIGHTAGE = 10;
  private static readonly TRAITS_AND_STYLE_SELECTIONS = 10;
  private static readonly TWO_SELECTIONS = 2;
  private contentFilterScoreMap: Map<string, number>;

  constructor() {
    this.contentFilterScoreMap = new Map<string, number>([]);
  }

  /**
   * Getter for the map of scores.
   */
  public get getContentFilterScoreMap() {
    this.contentFilterScoreMap.forEach((id,scores) => console.log(id,scores));
    return this.contentFilterScoreMap;
  }
  /**
   * Calculates the Matching score between current user and each other gym buddy profile and stores the results in a map.
   *
   * @param currentUser gym buddy profile of the current user
   * @param arrayOfProfiles array of gym buddy profiles
   */
     public async calculateMatchingScores(currentUser: GymBuddyProfileInfo, arrayOfProfiles: Array<GymBuddyProfileInfo>) {
      let matchScore;
      let anotherUserId;
      arrayOfProfiles.forEach(anotherUser => {
        matchScore = this.getTotalMatchScore(currentUser, anotherUser);
        //get id to store
        anotherUserId = anotherUser.getUserId;
        //store to hashmap: key is the other user id, value: total matching score.
        this.contentFilterScoreMap.set(anotherUserId,matchScore);
      });
    }
    /**
     * Remove the suggestion from the map after polling the suggestion.
     *
     * @param highestScoreId Highest score existing in the map
     */
    public deleteIdFromContentFilterScoreMap(highestScoreId) {
      this.contentFilterScoreMap.delete(highestScoreId);
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

  private getTraitsAndStyleScore(currentUser: GymBuddyProfileInfo, anotherUser: GymBuddyProfileInfo) {
    let traitsStyleScore = 0;
    /* user A personal traits match with user B preferred traits */
    for (const field of currentUser.getPersonalTraits) {
      if (anotherUser.getBuddyTraits.includes(field)) {
        traitsStyleScore++;
      }
    }
    /* user A personal train style match with User B preferred train style */
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


}
