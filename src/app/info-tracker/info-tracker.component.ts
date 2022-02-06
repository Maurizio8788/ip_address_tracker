import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Geolocation } from '../models/geolocation.model';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'maury-info-tracker',
  templateUrl: './info-tracker.component.html',
  styleUrls: ['./info-tracker.component.scss'],
})
export class InfoTrackerComponent implements OnInit, OnDestroy {
  infoTracker!: Geolocation;
  destroy$: Subject<any>;

  constructor(private trackerService: TrackerService) {
    this.destroy$ = new Subject<any>();
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.GetInfoTracker();
  }

  GetInfoTracker() {
    this.trackerService.trackerInformation$
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp) => {
        this.infoTracker = resp;
        this.trackerService.trackerLatLng$.next({
          position: {
            coords: {
              latitude: resp.location.lat,
              longitude: resp.location.lng,
            },
          },
        });
      });
  }
}
