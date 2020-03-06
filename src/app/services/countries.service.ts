import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

  getCountries()
  {
    return this.http.get("https://restcountries.eu/rest/v2/all");
  }

  getCurrencies()
  {
    return this.http.get("https://openexchangerates.org/api/currencies.json");
  }

}
