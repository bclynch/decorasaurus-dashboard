import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { CurrentProducerGQL, RegisterUserProducerGQL, AuthenticateUserProducerGQL } from '../generated/graphql';
import { map } from 'rxjs/operators';


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
    private cookieService: CookieService,
    public snackBar: MatSnackBar,
    private router: Router,
    private apollo: Apollo,
    private currentProducerGQL: CurrentProducerGQL,
    private registerUserProducerGQL: RegisterUserProducerGQL,
    private authenticateUserProducerGQL: AuthenticateUserProducerGQL
  ) {
    this.producerToken = new BehaviorSubject<string>(null);
  }

  fetchUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.currentProducerGQL.fetch()
        .pipe(
          map(result => {
            const currentProducer = result.data.currentProducer;

            // if logged in set our producer id and set the token
            if (currentProducer) {
              this.producerObject = currentProducer;
              console.log(this.producerObject);
              const cookieToken = this.cookieService.get('decorasaurus-token');
              if (cookieToken) this.producerToken.next(cookieToken);
            } else {
              // if it doesnt exist dump the token
              // this.cookieService.delete('decorasaurus-token');
            }
            resolve();
          })
        );
    });
  }

  createProducer(email: string, password: string): void {
    this.registerUserProducerGQL.mutate({
      email,
      password
    })
    .subscribe(
      () => this.loginProducer(email, password)
    );
  }

  loginProducer(email: string, password: string) {
      this.authenticateUserProducerGQL.mutate({
        email,
        password
      })
      .subscribe(
        (result) => {
          console.log(result);
          const token = result.data.authenticateUserProducer.jwtToken;

          if (token) {
            // reset apollo cache and refetch queries
            this.apollo.getClient().resetStore();
            this.cookieService.set('decorasaurus-token', token);
            this.producerToken.next(token);

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
        }
      );
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
