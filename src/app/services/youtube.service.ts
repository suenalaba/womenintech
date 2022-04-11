import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { HttpClient, HttpClientModule, HttpXhrBackend } from '@angular/common/http'; //youtube api
import { Injectable } from '@angular/core'; // at top
import { inject } from '@angular/core/testing';

@NgModule({
    imports: [
      HttpClientModule
    ]
})

@Pipe({
    name: 'safe'
  })
  export class SafePipe implements PipeTransform {
  
    constructor(private sanitizer: DomSanitizer) { }
    transform(url) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
  }

@Injectable({
    providedIn: 'root'
  })
    export class YoutubeService {

        private static instance: YoutubeService;
        private httpClient: HttpClient;
        private parsedVideos = [] as any;
        private APIKEY = 'AIzaSyD7U_0cft4oeknyAxfmh8m3gflsUw0-o3w'; // l.kh.b
        //AIzaSyDH-momG79qABXUQ623_YYZrExXltFPq1k; //bkhl

        /**
         * The Singleton's constructor should always be private to prevent direct
         * construction calls with the `new` operator.
         */
        private constructor() {
            this.httpClient = new HttpClient(new HttpXhrBackend({ build: () => new XMLHttpRequest() }));
         }

        // maximum number of search results we want to receive
        public static YOUTUBE_NUM_SEARCH_RESULTS = 8;

        public static getInstance(): YoutubeService {
            if (!YoutubeService.instance) {
                YoutubeService.instance = new YoutubeService();
            }
            return YoutubeService.instance;
        }

        /**
         * Function to search the Youtube API and parse the result
         * @param searchTerm the term to search youtube for 
         * returns the top 3 results' 1) video title, 2) video url, and 3) video thumbnail
         */
        getYoutubeAPI(searchTerm) {
            console.log('searching youtube for ', searchTerm);
            const url = 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults='+YoutubeService.YOUTUBE_NUM_SEARCH_RESULTS+'&q=' + searchTerm + '&key=' + this.APIKEY;
            console.log(url);
            this.httpClient.get<any>(url).subscribe((data) => { //needs to be <any> so that it can call .items on data without compile error
                this.parsedVideos = [];
                const response = data.items;
                //console.log(data);
                for (let i = 0; i < YoutubeService.YOUTUBE_NUM_SEARCH_RESULTS; i++)
                {
                    let tempDict = {};
                    //console.log(response[i]);
                    tempDict['Title'] = response[i].snippet.title;
                    tempDict['URL'] = 'https://www.youtube.com/embed/' + response[i].id.videoId;
                    tempDict['ThumbnailURL'] = response[i].snippet.thumbnails.high.url;
                    tempDict['ThumbnailWidth'] = response[i].snippet.thumbnails.high.width;
                    tempDict['ThumbnailHeight'] = response[i].snippet.thumbnails.high.height;

                    console.log(tempDict);

                    this.parsedVideos.push(tempDict);
                }

                console.log('youtube service retrieving:', this.parsedVideos);
                return this.parsedVideos;
            });

        }
    }
