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
        title: "The Jungle MMA",
        latitude: "1.2869044389498587",
        longitude: "103.84963819451265"
    },
    {
        title: "Evolve MMA (Clarke Quay Central)",
        latitude: "1.2896832895355255",
        longitude: "103.84702072975008"
    },
    {
      title: "Revolution Cecil St",
      latitude: "1.2798575868211335",
      longitude: "103.84866199709363"
    },
    {
      title: "BoOm Singapore",
      latitude: "1.2825082733779776",
      longitude: "103.84954627373418"
    },
    {
      title: "UFIT CBD Hub - Club Street",
      latitude: "1.2827022160371604",
      longitude: "103.84666523691632"
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
    const location = new google.maps.LatLng(1.2909820563409422, 103.84604372592945);
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
