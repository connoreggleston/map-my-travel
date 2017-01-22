import {Component, ElementRef, ViewChild} from '@angular/core';
import {NavController} from "ionic-angular";
import {HomePage} from "../home/home";

declare const google;

@Component({
  selector: 'list',
  templateUrl: 'list.html'
})
export class ListPage {

  places;

  constructor(public navCtrl: NavController) { }

  ionViewWillEnter() {
    this.places = JSON.parse(window.localStorage.getItem('savedLocations'));
  }

  clickPlace(place) {
    this.navCtrl.push(HomePage, {
      mapCenter: new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng),
      placeName: place.name
    });
  }

  ngAfterViewInit() {

  }
}
