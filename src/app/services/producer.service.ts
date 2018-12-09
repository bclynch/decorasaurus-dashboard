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
  producerObject: {
    id: string;
    email: string;
  };

  public producerToken: BehaviorSubject<string>;

  constructor(
    private apiService: APIService,
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apollo: Apollo
  ) {
    this.producerToken = new BehaviorSubject<string>(null);
  }

  fetchUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getCurrentProducer().valueChanges.subscribe(({ data }) => {
        console.log(data);

        // if logged in set our producer id and set the token
        if (data.currentProducer) {
          this.producerObject = data.currentProducer;
          console.log(this.producerObject);
          const cookieToken = this.cookieService.get('decorasaurus-token');
          if (cookieToken) this.producerToken.next(cookieToken);
        } else {
          // if it doesnt exist dump the token
          // this.cookieService.delete('decorasaurus-token');
        }
        resolve();
      });
    });
  }

  createProducer(email: string, password: string): void {
    this.apiService.registerProducer(email, password).subscribe(
      () =>  {
        this.loginProducer(email, password);
      },
      err => console.log(err)
    );
  }

  loginProducer(email: string, password: string) {
      this.apiService.authProducer(email, password).subscribe(({data}) => {
        console.log(data);
        if (data.authenticateUserProducer.jwtToken) {
          // reset apollo cache and refetch queries
          this.apollo.getClient().resetStore();
          this.cookieService.set('decorasaurus-token', data.authenticateUserProducer.jwtToken);
          this.producerToken.next(data.authenticateUserProducer.jwtToken);

          this.router.navigateByUrl('/');
          window.location.reload();
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
      });
  }

  logoutProducer() {
    this.cookieService.delete('decorasaurus-token');
    this.producerToken.next(null);
    this.producerObject = null;

    // reset apollo cache and refetch queries
    this.apollo.getClient().resetStore();

    this.router.navigateByUrl('/login');
    // this.snackBar.openFromComponent(CustomerStateSnackbar, {
    //   duration: 3000,
    //   verticalPosition: 'top',
    //   data: { message: 'Successfully logged out' },
    //   panelClass: ['snackbar-theme']
    // });
  }
}
