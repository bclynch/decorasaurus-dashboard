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
}
