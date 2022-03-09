import { MatchmakingAlgo } from './MatchmakingAlgo';
export class RecommendationEngine {
  constructor() {

  }

  public pollMatch(matchmakingAlgo) {
    const contentFilterScoreMap = matchmakingAlgo.getContentFilterScoreMap;

    /* returns the match with the highest score */
    const highestScoreId = this.getHighestScoreId(contentFilterScoreMap);

    //remove the match after found
    matchmakingAlgo.deleteIdFromContentFilterScoreMap(highestScoreId);
    if (highestScoreId === '') {
      //if highestScoreId is empty string, means no more matches to return
      return null;
    }
    else {
      return highestScoreId;
    }
  }

  public getAllMatches() {
    const matchmakingAlgo = new MatchmakingAlgo();
    matchmakingAlgo.calculateMatchingScores();
    return matchmakingAlgo;
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
