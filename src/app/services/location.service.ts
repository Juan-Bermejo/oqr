import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private http: HttpClient) { }

  reverse(lat:any, long:any)
  {//-34.6141664,-58.3875289
   return this.http.get("https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat="+ lat+"&lon="+ long );
  }

  getLatLong(address:string)
  {
    let addresFormat= address.replace(" ","+");
    return this.http.get("https://nominatim.openstreetmap.org/search?q=" + addresFormat + "&format=geojson&limit=1");
  }
}
