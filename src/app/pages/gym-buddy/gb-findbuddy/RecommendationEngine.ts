import { MatchmakingAlgo } from './MatchmakingAlgo';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class RecommendationEngine {
  matchmakingAlgo:MatchmakingAlgo
  userInfo:GymBuddyProfileInfo
  constructor(    private dbRetrieve: DbRetrieveService, private GymBuddyProfileInfo : GymBuddyProfileInfo
    ) {
    this.matchmakingAlgo = new MatchmakingAlgo(this.dbRetrieve)
    this.userInfo=GymBuddyProfileInfo;
  }

  public pollMatch() {
    const contentFilterScoreMap = this.matchmakingAlgo.getContentFilterScoreMap;

    /* returns the match with the highest score */
    const highestScoreId = this.getHighestScoreId(contentFilterScoreMap);

    //remove the match after founds
    this.matchmakingAlgo.deleteIdFromContentFilterScoreMap(highestScoreId);
    if (highestScoreId === '') {
      //if highestScoreId is empty string, means no more matches to return
      return null;
    }
    else {
      return highestScoreId;
    }
  }

  public getAllMatches(arrayOfProfiles) {
    this.matchmakingAlgo.calculateMatchingScores(this.userInfo,arrayOfProfiles);
    this.matchmakingAlgo.getContentFilterScoreMap;
  }

  private getHighestScoreId(contentFilterScoreMap: Map<string, number>) {
    let highestScore = -1;
    let highestScoreId = '';
    contentFilterScoreMap.forEach((matchingScore: number, id: string) => {
      if (matchingScore > highestScore) {
        highestScore = matchingScore;
        highestScoreId = id;
      }
    });
    return highestScoreId;
  }
}
