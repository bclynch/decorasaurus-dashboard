import { Injectable } from '@angular/core';
import { AllOrdersGQL, OrderByIdGQL } from '../generated/graphql';
import { map } from 'rxjs/operators';

@Injectable()
export class OrderService {

  constructor(
    private orderByIdGQL: OrderByIdGQL,
    private allOrdersGQL: AllOrdersGQL
  ) {

  }

  getOrderById(orderId: string) {
    return this.orderByIdGQL.watch({ orderId })
      .valueChanges
      .pipe(
        map(result => result.data.orderById)
      );
  }

  getAllOrders() {
    return this.allOrdersGQL.watch()
      .valueChanges
      .pipe(
        map(result => result.data.allOrders.nodes)
      );
  }
}
