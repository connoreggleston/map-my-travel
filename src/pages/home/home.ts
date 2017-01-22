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
  autocomplete;
  searchInput;
  mapInitialised: boolean = false;
  mapOptions;

  constructor(public navCtrl: NavController) {
    this.mapOptions = {
      center: new google.maps.LatLng(37.7909475, -122.40695499999998),
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false
    };
    this.searchInput = document.getElementById('autocomplete');
    this._centerMapForPlace = this._centerMapForPlace.bind(this);
  }

  ngAfterViewInit() {
    this._loadGoogleMaps();
    this._loadAutocomplete(document.getElementById('autocomplete').getElementsByTagName('input')[0]);
  }

  clearSearch() {
    this.searchInput = null;
  }

  _loadGoogleMaps() {
    if (typeof google == 'undefined' || typeof google.maps == 'undefined') {
      console.log('Google maps JavaScript needs to be loaded.');
      let script = document.createElement('script');
      script.id = 'googleMaps';
      script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
      document.body.appendChild(script);
    }
    else {
      this.mapInitialised = true;
      this.map = new google.maps.Map(this.mapElement.nativeElement, this.mapOptions);
    }
  }

  _loadAutocomplete(element) {
    this.autocomplete = new google.maps.places.Autocomplete(element, {types: ['geocode']});
    this.autocomplete.addListener('place_changed', this._centerMapForPlace);
  }

  _centerMapForPlace() {
    const place = this.autocomplete.getPlace();
    this.map.panTo(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
  }

}
