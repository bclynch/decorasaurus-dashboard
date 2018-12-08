import { Injectable } from '@angular/core';
import { SubscriptionLike, Observable, BehaviorSubject } from 'rxjs';
import { APIService } from './api.service';
import { v4 as uuid } from 'uuid';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ProducerService {

  producerUuid: string;
  currency: 'USD' | 'EUR' = 'EUR';
  isReloading = false;
  producerObject: {
    id: string;
    email: string;
  };

  public producerToken: BehaviorSubject<string>;
  // private _subject: BehaviorSubject<string>;

  constructor(
    private apiService: APIService,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apollo: Apollo
  ) {
    // this._subject = new BehaviorSubject<string>(null);
    this.producerToken = new BehaviorSubject<string>(null);
  }

  fetchUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.checkNewUser().then(
        (isNew) => {
          console.log('FETCH USER RESULT: ', isNew);
          if (isNew) {
            resolve();
          } else {
            // uses token to check if logged in / expired
            this.apiService.getCurrentProducer().valueChanges.subscribe(({ data }) => {
              console.log(data);

              if (!this.isReloading) {
                // if logged in set our producer id and set the token
                if (data.currentProducer) {
                  this.producerObject = data.currentProducer;
                  console.log(this.producerObject);
                  const cookieToken = this.cookieService.get('decorasaurus-token');
                  if (cookieToken) this.producerToken.next(cookieToken);
                } else {
                  // if it doesnt exist dump the token
                  this.cookieService.delete('decorasaurus-token');
                  this.cookieService.delete('decorasaurus-producer-id');
                }
              }
              resolve();
            });
          }
        }
      );
    });
  }

  private checkNewUser(): Promise<boolean> {
    // check if cookie identifying user exists
    // If it does not we have a new user and need to create an ID for them + cart
    return new Promise((resolve, reject) => {
      if (this.cookieService.get('decorasaurus-user')) {
        this.producerUuid = this.cookieService.get('decorasaurus-user');
        resolve(false);
      } else {
        const userUuid = uuid();
        this.cookieService.set( 'decorasaurus-user', userUuid );
        this.producerUuid = userUuid;

        resolve(true);
      }
    });
  }

  createProducer(data): void {
    console.log(data);
    this.apiService.registerProducer(data.email, data.matchingPassword.password).subscribe(
      () =>  {
        this.loginProducer(data.email, data.matchingPassword.password).then(
          (result) => console.log(result)
        );
      },
      err => console.log(err)
    );
  }

  loginProducer(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.authProducer(email, password).subscribe(({data}) => {
        console.log(data);
        if (data.authenticateUserCustomer.jwtToken) {
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();

          this.cookieService.set('decorasaurus-token', data.authenticateUserProducer.jwtToken);
          this.producerToken.next(data.authenticateUserProducer.jwtToken);
          // this.cookieService.set( 'decorasaurus-customer-id', resp.token.customer_id );

          // reload window to update db role
          this.isReloading = true;
          window.location.reload();
          resolve();
        } else {
          // incorrect login warning
          // this.snackBar.openFromComponent(CustomerStateSnackbar, {
          //   duration: 3000,
          //   verticalPosition: 'top',
          //   data: { message: `Incorrect login credentials, try again.` },
          //   panelClass: ['snackbar-theme']
          // });
        }
      }, (error) => {
        console.log('there was an error sending the query', error);
        reject(error);
      });
    });
  }

  logoutProducer(): Promise<void> {
    return new Promise((resolve) => {
      this.cookieService.delete('decorasaurus-token');
      this.cookieService.delete('decorasaurus-producer-id');
      this.producerToken.next(null);
      this.producerObject = null;

      // reset apollo cache and refetch queries
      this.apollo.getClient().resetStore();

      // this.snackBar.openFromComponent(CustomerStateSnackbar, {
      //   duration: 3000,
      //   verticalPosition: 'top',
      //   data: { message: 'Successfully logged out' },
      //   panelClass: ['snackbar-theme']
      // });
      resolve();
    });
  }
}
