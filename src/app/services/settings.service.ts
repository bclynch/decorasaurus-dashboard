import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { ProducerService } from './producer.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  public appInited: Observable<any>;
  private _subject: BehaviorSubject<any>;

  constructor(
    private producerService: ProducerService
  ) {
    this._subject = new BehaviorSubject<boolean>(false);
    this.appInited = this._subject;
  }

  appInit() {
    this.producerService.fetchUser().then(
      () => this._subject.next(true)
    );
  }
}
