import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { filter, Subject, takeUntil } from 'rxjs';
import { Position } from '../models/position.model';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'maury-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit, OnDestroy {
  @ViewChild('map') mapEl!: ElementRef;
  map!: L.Map;
  destroy$: Subject<any>;

  constructor(private trackerService: TrackerService) {
    this.destroy$ = new Subject<any>();
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(this.InitMap.bind(this));

    this.trackerService.trackerLatLng$
      .pipe(
        takeUntil(this.destroy$),
        filter((data) => data.position.coords.latitude !== null)
      )
      .subscribe((resp) => {
        this.ChangePosition(resp.position);
      });
  }

  InitMap(position: Position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords: L.LatLngExpression = [latitude, longitude];

    this.map = L.map(this.mapEl.nativeElement).setView(coords, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    this.AddMarker(coords);
  }

  ChangePosition(position: Position): void {
    const { latitude } = position.coords;
    const { longitude } = position.coords;

    const coords: L.LatLngExpression = [latitude, longitude];
    this.map.panTo(coords);
    this.AddMarker(coords);
  }

  AddMarker(coords: L.LatLngExpression): void {
    let icon = L.icon({
      iconUrl: '/assets/img/icon-location.svg',
      iconSize: [35, 45],
    });

    L.marker(coords, { icon }).addTo(this.map);
  }
}
