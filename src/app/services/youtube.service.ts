/* eslint-disable @typescript-eslint/dot-notation */
import { HttpClient, HttpXhrBackend } from '@angular/common/http';
import { Injectable, Pipe, PipeTransform, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { delay } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
/**
 * Allows us to connect to the YouTube API endpoint to search for and retrieve videos. Uses Singleton design pattern.
 */
export default class YoutubeService {
  private static instance: YoutubeService;

  constructor(
    ) { }

  /**
   * Controls access to the singleton instance of YoutubeService. Everyone will interface with this and only this
   *
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
   *
   * @param searchTerm the term to search youtube for
   * returns the results' 1) video title, 2) video url, and 3) video thumbnail
   */
  getYoutubeAPI(searchTerm, typee): Promise<any> {
    // list of api keys we can work with (each can call a max of 100 times)
    const API_KEY_AR = [
    'AIzaSyA8JCVTMOaGbLL92LxfcY4ZwzDSRLzZqbU', //M560
    //'AIzaSyApxaBF3ddo3wMeIqfr3OEBtbrBPst92jU', //G560
    //'AIzaSyCGUCYsNQpCM34NwbSzmG-web56Sik8Pbo', //ESp
    //'AIzaSyChbvnT57XxBmNfrN4nLnGICNg3YDhbEo0', //tranz
    //'AIzaSyBpnu2GzUd4BIQ3241u1cPnz4JQ72erN9w', //kryzs
    // 'AIzaSyAu6XSE7LGtxxHJmP_m0yQAKfRZODD_FDQ', //mn4m
    // 'AIzaSyDGp0pRQ-nr7k67SH2Gz7jDovryFdYoZwc', //rxdnstk
    // 'AIzaSyAPry9QnN6oQQUk4ibdx4lTGmEioVkgRfI', //bkhl2
    // 'AIzaSyCdWBniI98tMsvFoVUdCsf43FwI6kDQ8oI', //blkh
    // 'AIzaSyCRi3DvIBgO884dMmYmxKP2Kz8NQYrHecA', //rkz
    // 'AIzaSyDH-momG79qABXUQ623_YYZrExXltFPq1k', //bkhl
    //'AIzaSyD7U_0cft4oeknyAxfmh8m3gflsUw0-o3w' // l.kh.b
    ];

    //the api call we are making
    console.log('searching youtube for ', searchTerm);

    //pick a random api key to use. this will result in better load times on average than naive iteration
    const choicee = Math.floor(Math.random() * (API_KEY_AR.length - 1 + 0)) + 0;
    const APIKEY = API_KEY_AR[choicee];
    console.log('using key ', APIKEY);

    const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=' + searchTerm + '&key=' + APIKEY;

    //inject a new http client
    const http = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));

    //to store and return our result
    const parsedVideos = [];
    http.get<any>(url).subscribe( //needs to be <any> so that it can call .items on data without compile error
      data => {
        console.log('data');
        //delay due to youtube api's rate limits
        delay(500);
        const response = data.items;
        parsedVideos['Title'] = response[0].snippet.title;
        parsedVideos['URL'] = 'https://www.youtube.com/embed/' + response[0].id.videoId;
        parsedVideos['ThumbnailURL'] = response[0].snippet.thumbnails.high.url;
        parsedVideos['ThumbnailWidth'] = response[0].snippet.thumbnails.high.width;
        parsedVideos['ThumbnailHeight'] = response[0].snippet.thumbnails.high.height;
        console.log('returning', parsedVideos);
        return new Promise(function(resolve, reject) {
          resolve(parsedVideos);
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error => {
        console.log('error: youtube api limit reached');
        if (typee === 1) {
          console.log('recommendations');
          parsedVideos['ThumbnailWidth'] = 480;
          parsedVideos['ThumbnailHeight'] = 360;
          parsedVideos['URL'] = 'https://www.youtube.com/embed/2pLT-olgUJs';
        }
        if (typee === 2) {
          console.log('warmup');
          parsedVideos['ThumbnailWidth'] = 480;
          parsedVideos['ThumbnailHeight'] = 360;
          parsedVideos['URL'] = 'https://www.youtube.com/embed/CSrBaHX3HxQ';
        }
        if (typee === 3) {
          console.log('cooldown');
          parsedVideos['ThumbnailWidth'] = 480;
          parsedVideos['ThumbnailHeight'] = 360;
          parsedVideos['URL'] = 'https://www.youtube.com/embed/BXBtzvpIBSs';
        }
        delay(500);

        console.log('returning placeholder', parsedVideos);
        return new Promise(function(resolve, reject) {
          resolve(parsedVideos);
        });
      }
    );
    return new Promise(function(resolve, reject) {
      resolve(parsedVideos);
    });
  }
}

@Pipe({
    name: 'safe'
  })
  /**
   * SafePipe class to sanitise URLs to prevent cross-site scripting attacks. Used to sanitise the youtube API urls.
   */
  export class SafePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.sanitizer.sanitize(SecurityContext.URL, url));
      //return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }
