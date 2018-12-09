import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ENV } from '../../environments/environment';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';

// mutations
import {
  registerUserProducerMutation,
  authUserProducerMutation
} from '../api/mutations/producer.mutation';

import { currentProducerQuery } from '../api/queries/producer.query';
import { allOrdersQuery, orderByIdQuery } from '../api/queries/order.query';

@Injectable()
export class APIService {

  constructor(
    private http: Http,
    private httpClient: HttpClient,
    private apollo: Apollo
  ) {}

  // *******************************************************************
  // ************************* Queries *********************************
  // *******************************************************************

  getCurrentProducer(): any {
    return this.apollo.watchQuery<any>({
      query: currentProducerQuery
    });
  }
  getAllOrders(): any {
    return this.apollo.watchQuery<any>({
      query: allOrdersQuery
    });
  }
  getOrderById(orderId: string): any {
    return this.apollo.watchQuery<any>({
      query: orderByIdQuery,
      variables: {
        orderId
      }
    });
  }

  // *******************************************************************
  // ************************* Mutations *********************************
  // *******************************************************************

  // Create Producer
  registerProducer(email: string, password: string) {
    return this.apollo.mutate({
      mutation: registerUserProducerMutation,
      variables: {
        email,
        password
      }
    });
  }

  // Auth Producer
  authProducer(email: string, password: string): Observable<any> {
    return this.apollo.mutate({
      mutation: authUserProducerMutation,
      variables: {
        email,
        password
      }
    });
  }

  // shippo
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
