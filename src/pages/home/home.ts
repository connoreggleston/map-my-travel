import {Component, ElementRef, ViewChild, Renderer} from '@angular/core';
import {NavController} from "ionic-angular";

declare const google;

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;

  map: any;
  mapInitialised: boolean = false;
  latitude;
  longitude;
  zoom;

  constructor(public navCtrl: NavController) {
    this.latitude = 37.7909475;
    this.longitude = -122.40695499999998;
    this.zoom = 12;
  }

  ngAfterViewInit() {
    this.loadGoogleMaps();
  }

  loadGoogleMaps() {
    if (typeof google == "undefined" || typeof google.maps == "undefined") {
      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();

      console.log("online, loading map");

      //Load the SDK
      window['mapInit'] = () => {
        this.initMap();
        this.enableMap();
      };

      let script = document.createElement("script");
      script.id = "googleMaps";

      script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';

      document.body.appendChild(script);
    }
    else {
      this.initMap();
      this.enableMap();
    }

  }

  initMap() {
    this.mapInitialised = true;
    let latLng = new google.maps.LatLng(this.latitude, this.longitude);

    let mapOptions = {
      center: latLng,
      zoom: this.zoom,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false
    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  disableMap() {
    console.log("disable map");
  }

  enableMap() {
    console.log("enable map");
  }

}
