import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController, NavParams} from "ionic-angular";

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

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    const mapCenter = navParams.get('mapCenter') || new google.maps.LatLng(37.7909475, -122.40695499999998);
    this.mapOptions = {
      center: mapCenter,
      zoom: 12,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoomControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      mapTypeControl: false
    };
    this.searchInput = document.getElementById('autocomplete');
    this._setLocation = this._setLocation.bind(this);
  }

  ngAfterViewInit() {
    this._loadGoogleMaps();
    this._loadAutocomplete(document.getElementById('autocomplete').getElementsByTagName('input')[0]);
  }

  clearSearch() {
    this.searchInput = null;
  }

  addLocation() {
    const place = this.autocomplete.getPlace();
    let lat;
    let lng;
    try {
      lat = place.geometry.location.lat();
      lng = place.geometry.location.lng();
    } catch (e) {
      alert('Search for a location');
      return false;
    }

    const location = new google.maps.LatLng(lat, lng);

    new google.maps.Marker({
      position: location,
      map: this.map
    });

    this._savePlace(place)
      .then(() => console.log('successful save'))
      .catch(error => alert(error));
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
      if (!window.localStorage.getItem('savedLocations')) {
        window.localStorage.setItem('savedLocations', JSON.stringify([]));
      } else {
        let locations = JSON.parse(window.localStorage.getItem('savedLocations'));
        for (let location of locations) {
          new google.maps.Marker({
            position: location,
            map: this.map
          });
        }
      }
    }
  }

  _loadAutocomplete(element) {
    this.autocomplete = new google.maps.places.Autocomplete(element, {types: ['geocode']});
    this.autocomplete.addListener('place_changed', this._setLocation);
  }

  _setLocation() {
    const place = this.autocomplete.getPlace();
    this.map.panTo(new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng()));
  }

  _savePlace(place) {
    return new Promise((resolve, reject) => {
      let savedLocations = JSON.parse(window.localStorage.getItem('savedLocations'));
      savedLocations.push(place);
      try {
        window.localStorage.setItem('savedLocations', JSON.stringify(savedLocations));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  }

}
