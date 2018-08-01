import { Component, OnInit } from '@angular/core';
import { icon, latLng, marker, polyline, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrls: ['./map-screen.component.scss']
})
export class MapScreenComponent implements OnInit {

  constructor() { }
  streetMaps: any;
  wMaps:any;
  summit:any;
  paradise:any;
  route:any;
  layersControl:any;
  options:any;

  private decodePoly(encoded:string):any {
		encoded = "u}~mAy}dyMi@kACK?GL]BEtA?RPbBeA?CAC?GFKJGL?@@FUFYm@]e@YW[u@]AAACXeAPORWXgBDy@Cs@CYc@gB?[Ry@EGAG?KJOFAJiB?SCkABi@aBy@aAa@YIy@QyEiAeEeAUIFQkLsCUGOEw@MeAOqFo@Kt@";
    	var points=[ ]
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

   		points.push([( lat / 1E5),( lng / 1E5)]);

  	}
  	return points;
}

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
  this.summit = marker([ 12.943260,77.690619 ], {
    icon: icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
      iconUrl: 'leaflet/marker-icon.png',
      shadowUrl: 'leaflet/marker-shadow.png'
    })
  });
  this.paradise = marker([ 12.949830,77.699127 ], {
    icon: icon({
      iconSize: [ 25, 41 ],
      iconAnchor: [ 13, 41 ],
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
    	layers: [ this.streetMaps, this.route, this.summit, this.paradise ],
    	zoom: 7,
    	center: latLng([ 12.943260,77.690619 ])
  	};
  }







  // Marker for the parking lot at the base of Mt. Ranier trails


  // Path from paradise to summit - most points omitted from this example for brevity





  // Set the initial set of displayed layers (we could also use the leafletLayers input binding for this)


}
