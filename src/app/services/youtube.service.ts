import { HttpClient, HttpXhrBackend } from '@angular/common/http'; //youtube api

import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
/**
 * YoutubeService class lets clients access the service's instance via getInstance()
 */
export class YoutubeService {
  private static instance: YoutubeService;

  constructor(
  ) { }

  /**
   * Controls access to the singleton instance.
   * @returns the YoutubeService instance (only one in existence)
   */
  public static getInstance(): YoutubeService {
    if (!YoutubeService.instance) {
      YoutubeService.instance = new YoutubeService();
    }
    return YoutubeService.instance;
  }

  /**
   * Function to search the Youtube API and parse the result
   * @param searchTerm the term to search youtube for 
   * returns the results' 1) video title, 2) video url, and 3) video thumbnail
   */
  getYoutubeAPI(searchTerm) {
    const APIKEY = 'AIzaSyAu6XSE7LGtxxHJmP_m0yQAKfRZODD_FDQ' //mn4m
    // fresh api keys:
    // 'AIzaSyDmTKmRx9nb2X5vXhR6yTa-tmhwfn--sns' //M560
    // 'AIzaSyApxaBF3ddo3wMeIqfr3OEBtbrBPst92jU' //G560
    
    // hit the limit:
    //'AIzaSyDGp0pRQ-nr7k67SH2Gz7jDovryFdYoZwc'//rxdnstk
    //'AIzaSyAPry9QnN6oQQUk4ibdx4lTGmEioVkgRfI' //bkhl2
    //'AIzaSyCdWBniI98tMsvFoVUdCsf43FwI6kDQ8oI' //blkh
    //'AIzaSyCRi3DvIBgO884dMmYmxKP2Kz8NQYrHecA' //rkz
    //'AIzaSyDH-momG79qABXUQ623_YYZrExXltFPq1k'; //bkhl
    //'AIzaSyD7U_0cft4oeknyAxfmh8m3gflsUw0-o3w'; // l.kh.b

    let delayres = delay(500);
    let http = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
    console.log('searching youtube for ', searchTerm);
    const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=' + searchTerm + '&key=' + APIKEY;
    const parsedVideos = [];
    http.get<any>(url).subscribe((data) => { //needs to be <any> so that it can call .items on data without compile error
      const response = data.items;
      parsedVideos['Title'] = response[0].snippet.title;
      parsedVideos['URL'] = 'https://www.youtube.com/embed/' + response[0].id.videoId;
      parsedVideos['ThumbnailURL'] = response[0].snippet.thumbnails.high.url;
      parsedVideos['ThumbnailWidth'] = response[0].snippet.thumbnails.high.width;
      parsedVideos['ThumbnailHeight'] = response[0].snippet.thumbnails.high.height;
    });
    console.log('returning', parsedVideos);
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