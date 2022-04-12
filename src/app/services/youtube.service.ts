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
    const APIKEY = 'AIzaSyCRi3DvIBgO884dMmYmxKP2Kz8NQYrHecA' //rkz
    //'AIzaSyDH-momG79qABXUQ623_YYZrExXltFPq1k'; //bkhl
    //'AIzaSyD7U_0cft4oeknyAxfmh8m3gflsUw0-o3w'; // l.kh.b
    //

    console.log('searching youtube for ', searchTerm);
    const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=' + searchTerm + '&key=' + APIKEY;
    const parsedVideos = [];
    this.http.get<any>(url).subscribe((data) => { //needs to be <any> so that it can call .items on data without compile error
      const response = data.items;
      parsedVideos['Title'] = response[0].snippet.title;
      parsedVideos['URL'] = 'https://www.youtube.com/embed/' + response[0].id.videoId;
      parsedVideos['ThumbnailURL'] = response[0].snippet.thumbnails.high.url;
      parsedVideos['ThumbnailWidth'] = response[0].snippet.thumbnails.high.width;
      parsedVideos['ThumbnailHeight'] = response[0].snippet.thumbnails.high.height;
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