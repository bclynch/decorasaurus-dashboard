import { Injectable } from '@angular/core';
import { APIService } from './api.service';

@Injectable()
export class OrderService {

  constructor(
    private apiService: APIService,
  ) {

  }

  getOrderById(orderId: string) {
    return this.apiService.getOrderById(orderId);
  }

  getAllOrders() {
    return this.apiService.getAllOrders();
  }
}
