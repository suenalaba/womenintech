import { HttpClient } from '@angular/common/http'; //youtube api

import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class YoutubeService {

    constructor(
      private http: HttpClient
    ) { }

      /**
   * Function to search the Youtube API and parse the result
   * @param searchTerm the term to search youtube for 
   * returns the top 3 results' 1) video title, 2) video url, and 3) video thumbnail
   */
  getYoutubeAPI(searchTerm) {
    const APIKEY = 'AIzaSyD7U_0cft4oeknyAxfmh8m3gflsUw0-o3w'; // l.kh.b
    //'AIzaSyDH-momG79qABXUQ623_YYZrExXltFPq1k'; //bkhl
    //
    //'AIzaSyCRi3DvIBgO884dMmYmxKP2Kz8NQYrHecA' //rkz
    const YOUTUBE_NUM_SEARCH_RESULTS = 1;

    console.log('searching youtube for ', searchTerm);
    const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults='+YOUTUBE_NUM_SEARCH_RESULTS+'&q=' + searchTerm + '&key=' + APIKEY;
    const parsedVideos = {};
    this.http.get<any>(url).subscribe((data) => { //needs to be <any> so that it can call .items on data without compile error
      const response = data.items;
      for (let i = 0; i < YOUTUBE_NUM_SEARCH_RESULTS; i++)
      {
        parsedVideos['Title'] = response[i].snippet.title;
        parsedVideos['URL'] = 'https://www.youtube.com/embed/' + response[i].id.videoId;
        parsedVideos['ThumbnailURL'] = response[i].snippet.thumbnails.high.url;
        parsedVideos['ThumbnailWidth'] = response[i].snippet.thumbnails.high.width;
        parsedVideos['ThumbnailHeight'] = response[i].snippet.thumbnails.high.height;
      }
    });
    return parsedVideos;
  }

}

@Pipe({
    name: 'safe'
  })
  export class SafePipe implements PipeTransform {
  
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }