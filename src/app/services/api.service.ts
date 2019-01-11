import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ENV } from '../../environments/environment';

@Injectable()
export class APIService {

  constructor(
    private http: Http
  ) {}

  // *******************************************************************
  // ************************* Shippo *********************************
  // *******************************************************************
  createShippingLabel(addressFrom, addressTo, parcels) {
    return this.http.post(`${ENV.apiBaseURL}/shippo/create-label`, { addressFrom, addressTo, parcels })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  validateAddress(address) {
    return this.http.post(`${ENV.apiBaseURL}/shippo/validate-address`, { address })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  createRefund(transactionId: string) {
    return this.http.post(`${ENV.apiBaseURL}/shippo/create-refund-label`, { transactionId })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }

  trackPackage(trackingNumber: string, carrier: string) {
    return this.http.post(`${ENV.apiBaseURL}/shippo/track`, { trackingNumber, carrier })
    .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
    ).pipe(catchError(
        (error: Response) => {
          return Observable.throw('Something went wrong');
        }
    ));
  }
}
