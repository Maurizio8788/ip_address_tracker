import { Component, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TrackerService } from '../tracker.service';

@Component({
  selector: 'maury-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  destory$: Subject<any>;
  isValidIp: boolean;
  constructor(private trackerService: TrackerService) {
    this.destory$ = new Subject<any>();
    this.isValidIp = true;
  }

  ngOnInit(): void {}

  onSubmit(value: string) {
    if (!this.ValidIpAddress(value)) {
      this.isValidIp = false;
      return;
    }
    this.isValidIp = true;
    this.trackerService
      .GetInfoTrackerIp(value)
      .pipe(takeUntil(this.destory$))
      .subscribe((resp) => {
        this.trackerService.trackerInformation$.next(resp);
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

  ValidIpAddress(ip: string) {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
      ip
    );
  }
}
