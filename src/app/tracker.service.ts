import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Geolocation } from '../app/models/geolocation.model';

@Injectable({ providedIn: 'root' })
export class TrackerService {
  trackerInformation$: Subject<Geolocation>;
  trackerLatLng$: Subject<{
    position: { coords: { latitude: number; longitude: number } };
  }>;
  constructor(private http: HttpClient) {
    this.trackerInformation$ = new Subject<Geolocation>();
    this.trackerLatLng$ = new Subject<{
      position: {
        coords: { latitude: number; longitude: number };
      };
    }>();
  }

  GetInfoTrackerIp(ip: string): Observable<Geolocation> {
    let params = new HttpParams();
    params = params.append('apiKey', 'at_I0knx7aQ2zerHbhXNG9vnDxGB7HjK');
    params = params.append('ipAddress', ip);
    return this.http.get<Geolocation>(
      'https://geo.ipify.org/api/v2/country,city,vpn',
      { params }
    );
  }
}
