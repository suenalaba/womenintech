import { Component, OnInit } from '@angular/core';
import { ViewChild, ElementRef } from '@angular/core';

declare var google: any;

@Component({
  selector: 'app-display-gyms',
  templateUrl: './display-gyms.page.html',
  styleUrls: ['./display-gyms.page.scss'],
})
export class DisplayGymsPage implements OnInit {

  map: any;

  @ViewChild('map', {read: ElementRef, static: false}) mapRef: ElementRef;

  infoWindows: any = [];
  markers: any = [
    {
        title: "Anytime Fitness Nanyang CC",
        latitude: "1.3446769843267867",
        longitude: "103.6921381067168"
    },
    {
        title: "Jurong West ActiveSG Gym",
        latitude: "1.3403339174867968",
        longitude: "103.69367161695456"
    },
    {
        title: "Fitness First - One George Street",
        latitude: "1.28621796655656",
        longitude: "103.8475568003505"
    },
    {
        title: "NTU Sports and Recreation Centre (SRC) Hall D",
        latitude: "1.349639123551359",
        longitude: "103.68782849842782"
    },
    {
        title: "NTU Staff Club Gym",
        latitude: "1.3511795141546894",
        longitude: "103.68801192920789"
    },
    {
      title: "The Wave",
      latitude: "1.349309039723673",
      longitude: "103.68944268929248"
    },
    {
      title: "North Hill Gym, Binjai Hall 19A",
      latitude: "1.3548348111666786",
      longitude: "103.68787552913615"
    },
    {
      title: "Spartans Boxing Club Jurong West",
      latitude: "1.3503332109014345",
      longitude: "103.70296136890298"
    },
    {
      title: "Amore Fitness & Define",
      latitude: "1.3001766947873528",
      longitude: "103.84537272919611"
    },
    {
      title: "Vigeo Fitness | Personal Training Singapore",
      latitude: "1.2978813139944605",
      longitude: "103.8449650334324"
    }
  ];

  constructor() { }

  ionViewDidEnter() {
    this.showMap();
  }

  
  addMarkersToMap(markers) {
    for (let marker of markers) {
      let position = new google.maps.LatLng(marker.latitude, marker.longitude);
      let mapMarker = new google.maps.Marker({
        position: position,
        title: marker.title,
        latitude: marker.latitude,
        longitude: marker.longitude
      });

      mapMarker.setMap(this.map);
      this.addInfoWindowToMarker(mapMarker);
    }
  }

  addInfoWindowToMarker(marker) {
    let infoWindowContent = '<div id="content">' +
                              '<h2 id="firstHeading" class"firstHeading">' + marker.title + '</h2>' +
                              '<p>Latitude: ' + marker.latitude + '</p>' +
                              '<p>Longitude: ' + marker.longitude + '</p>' +
                            '</div>';

    let infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent
    });

    marker.addListener('click', () => {
      this.closeAllInfoWindows();
      infoWindow.open(this.map, marker);
    });
    this.infoWindows.push(infoWindow);
  }

  closeAllInfoWindows() {
    for(let window of this.infoWindows) {
      window.close();
    }
  }

  showMap() {
    const location = new google.maps.LatLng(1.3463732682538614, 103.68140508360123);
    const options = {
      center: location,
      zoom: 15,
      disableDefaultUI: true
    }
    this.map = new google.maps.Map(this.mapRef.nativeElement, options);
    this.addMarkersToMap(this.markers);
  }

  ngOnInit() {
  }

}
