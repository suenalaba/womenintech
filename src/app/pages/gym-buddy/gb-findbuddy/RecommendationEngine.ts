import { MatchmakingAlgo } from './MatchmakingAlgo';
import { DbRetrieveService } from './../../../services/db-retrieve.service';
import { GymBuddyProfileInfo } from './GymBuddyInformation';


export class RecommendationEngine {
  matchmakingAlgo:MatchmakingAlgo
  userInfo:GymBuddyProfileInfo
  dictOfProfiles:Map<string, GymBuddyProfileInfo>
  constructor(    private dbRetrieve: DbRetrieveService, private gymBuddyProfileInfo : GymBuddyProfileInfo
    ) {
    this.matchmakingAlgo = new MatchmakingAlgo(this.dbRetrieve)
    this.userInfo=gymBuddyProfileInfo;
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
      return this.dictOfProfiles.get(highestScoreId);
    }
  }

  public getAllMatches(dictOfProfiles) {
    this.dictOfProfiles=dictOfProfiles;
    let arrayOfProfiles= new Array<GymBuddyProfileInfo>();
    arrayOfProfiles=Array.from(this.dictOfProfiles.values())
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
