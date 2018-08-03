import { Component, OnInit } from '@angular/core';
import { icon, latLng, marker,Layer, polyline, tileLayer, map } from 'leaflet';
import { HttpClient } from '@angular/common/http'
import {HostListener} from '@angular/core'
declare let L;

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss'],
  host: {'(click)': 'filterCall(this.evt)'}
})
export class MapScreenComponent implements OnInit {

  constructor(private httpRet: HttpClient) { }

  streetMaps: any;
  wMaps: any;
  summit: any;
  paradise: any;
  route: any;
  layersControl: any;
  options: any;
  resultList: any;
  mapToDisplay: Object;
  markers: Layer[] = [];
  CLIENT_ID="KZNWNI5VO2IZU0A2PX1YEKMBJQPTRPDMMULMAXGUWV33YK4D";
  CLIENT_SECRET="5AXIL41M1U0RMXCLGPVTCUZWS1I1SE03QQFT43YZOROD2X3I";
  GOOGLE_API="AIzaSyDRdQIa-EGFEOJfRH2Ig6Yn1BM8YXKBABc";
  venueMap: Map<String,any>;

/**
 *
 * @param encoded
 */
  private decodePoly(encoded: string): any {    
    var points = []
    var index = 0, len = encoded.length;
    var lat = 0, lng = 0;
    while (index < len) {
      var b, shift = 0, result = 0;
      do {

        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);


      var dlat = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = encoded.charAt(index++).charCodeAt(0) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      var dlng = ((result & 1) != 0 ? ~(result >> 1) : (result >> 1));
      lng += dlng;

      points.push([(lat / 1E5), (lng / 1E5)]);

    }
    return points;
  }
/**
 *
 */
  private getFourSqrData() {
    console.log(L);
    /*this.httpRet.get("https://api.foursquare.com/v2/venues/search?client_id="+this.CLIENT_ID+"&client_secret="+this.CLIENT_SECRET+"&v=20130815&ll=17.416471,78.438247&query=restuarant").subscribe((resultListToDisplay:Object) => this.processJsonList(resultListToDisplay));*/
    this.httpRet.get("/assets/results/foursquare.json").subscribe((resultListToDisplay:Object) => this.processJsonList(resultListToDisplay));
  }

  private fetchRoute(from,to) {
      /*this.httpRet.get("https://maps.googleapis.com/maps/api/directions/json?origin=Disneyland&destination=Universal+Studios+Hollywood4&key=AIzaSyCL9XmjDgBbamMh3m0Ze5988_diW2nb6B0")
      .subscribe((routeListToDisplay:Object) => this.processRouteList(routeListToDisplay));*/
      this.httpRet.get("/assets/results/directions.json").subscribe((routeListToDisplay:Object) => this.processRouteList(routeListToDisplay));
  }

  private processRouteList(routeList) {
    if(routeList.routes > 0) {
      this.route.push(this.decodePoly(routeList.routes[0].overview_polyline.points));
    }
  }

  private fetchFourSquareImages(venueId,venue) {
    var version="20180802"
    /*this.httpRet.get("https://api.foursquare.com/v2/venues/"+venueId+"/photos?client_id="+this.CLIENT_ID+"&client_secret="+this.CLIENT_SECRET+"&v="+version).subscribe((photoListToDisplay:Object) => this.processImageList(photoListToDisplay,venueId,venue));*/
     this.httpRet.get("/assets/results/photo.json").subscribe((photoListToDisplay:Object) => this.processImageList(photoListToDisplay,venueId,venue));
  }

  private processImageList(result,venueId,venue) {
    this.convertVenueToGeoJson(venue,result);

  }

  private convertVenueToGeoJson(venue,photoResponse) {
    var location = venue.location;
    var category = venue.categories[0];
    var imgSrc = photoResponse.response.photos.count > 0?photoResponse.response.photos.items[0].prefix+"100"+photoResponse.response.photos.items[0].suffix:category.icon.prefix+"64"+category.icon.suffix;
    if(location.lat!=null && location.lng!=null) {

      var geojsonFeature = {
        "type": "Feature",
        "properties": {
            "name":venue.name,
            "amenity": category.name,
            "popupContent": ""
        },
        "geometry": {
            "type": "Point",
            "coordinates": [location.lat,  location.lng],
            "custom": venue
        }
    };
    let options = { "color": "#ff7800", "weight": 5, "opacity": 0.65 };
    
    
      var markerToDisplay = marker([location.lat, location.lng],{                
        icon:  new L.DivIcon({
          className: 'my-div-icon',
          html: '<img class="my-div-image" id="'+venue.id+'" src="'+imgSrc+'">'+
          '<div class="imageHolder">'+
          '<span class="my-div-span">'+venue.name+'</span>'+
          '</div>'
          })    
      });    
      var venueMapToProcess = this.venueMap;   
      markerToDisplay.options.title = venue.id;             
      markerToDisplay.on("click", function (event) {
        alert(event.target.options.title);
        var venue = venueMapToProcess.get(event.target.options.title);
        alert(venue);
      });
      this.markers.push(markerToDisplay);
    }
  }

  processJsonList(resultListToDisplay: any) {
    this.venueMap = new Map<String,any>();
    this.resultList = resultListToDisplay;
    if(this.resultList.response!=null) {
      var venues = this.resultList.response.venues;
      for(var i=0;i<venues.length;i++) {
        var venue = venues[i];
        this.venueMap.set(venue.id,venue);
        this.fetchFourSquareImages(venue.id,venue);
      }
    }
  }


/**
 *
 */
  ngOnInit() {
    this.streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    this.wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
      detectRetina: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    // Marker for the top of Mt. Ranier
    this.summit = marker([48.8593152, 2.3104179], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    });
    this.paradise = marker([48.8775512, 2.3207157], {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'leaflet/marker-icon.png',
        shadowUrl: 'leaflet/marker-shadow.png'
      })
    });
    this.route = polyline(this.decodePoly(""));
    //Layers control object with our two base layers and the three overlay layers
    this.layersControl = {
      baseLayers: {
        'Street Maps': this.streetMaps,
        'Wikimedia Maps': this.wMaps
      },
      overlays: {
        'Mt. Rainier Summit': this.summit,
        'Mt. Rainier Paradise Start': this.paradise,
        'Mt. Rainier Climb Route': this.route
      }
    };
    this.options = {
      layers: [this.streetMaps, this.route, this.summit, this.paradise],
      zoom: 13,
      center: latLng([48.8593152, 2.3104179])
    };
    this.getFourSqrData();
  }

  onMapReady(mapObject: any) {
    this.mapToDisplay = mapObject;
    console.log(mapObject);
 }

 @HostListener('click') filterCall(evt){
  console.log("User Click "+evt);
}
}
