import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { MatTableDataSource } from '@angular/material';
import { APIService } from 'src/app/services/api.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  order;
  displayedColumns: string[] = ['name', 'id', 'quantity', 'pdfUrl'];
  dataSource;

  paramsSubscription: SubscriptionLike;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private apiService: APIService
  ) {
    this.paramsSubscription = this.route.params.subscribe((params) => {
      this.orderService.getOrderById(params.orderId).valueChanges.subscribe(
        ({ data }) => {
          this.order = data.orderById;
          console.log(this.order);
          const items = this.order.orderItemsByOrderId.nodes.map((item) => ({ name: item.productByProductSku.name, quantity: item.quantity, id: item.id, pdfUrl: item.productLinksByOrderItemId.nodes.filter((url) => url.type === 'PDF')[0].url }));
          console.log(items);
          this.dataSource = new MatTableDataSource(items);
        }
      );
    });
  }

  ngOnInit() {
  }

  createShippingLabel() {
    const addressFrom  = {
      'name': 'Shawn Ippotle',
      'street1': '215 Clayton St.',
      'city': 'San Francisco',
      'state': 'CA',
      'zip': '94117',
      'country': 'US'
    };

    const addressTo = {
      'name': 'Mr Hippo',
      'street1': '391 2nd Ave',
      'city': 'New York',
      'state': 'NY',
      'zip': '10010',
      'country': 'US'
    };

    const parcels = [{
      'length': '5',
      'width': '5',
      'height': '5',
      'distance_unit': 'in',
      'weight': '2',
      'mass_unit': 'lb'
    }];

    this.apiService.createShippingLabel(addressFrom, addressTo, parcels).subscribe(
      ({ label }) => {
        console.log(label);
        if (label.status === 'SUCCESS') {
          // save relevant shipping information
          const shippingObject = {
            labelUrl: label.label_url,
            createdAt: label.object_created,
            trackingNumber: label.tracking_number,
            trackingUrl: label.tracking_url_provider,
            amount: label.rate.amount,
            provider: label.rate.provider,
            transactionId: label.object_id
          };

          // test options https://goshippo.com/docs/tracking/#test-mode
          this.apiService.trackPackage('SHIPPO_TRANSIT', 'shippo').subscribe(
            (data) => console.log(data)
          );
        } else {
          // some sort of alert it didn't work
        }
      }
    );
  }

  validateAddress() {
    const address1 = {
      name: 'Shawn Ippotle',
      company: 'Shippo',
      street1: '215 Clayton St.',
      street2: null,
      city: 'San Francisco',
      state: 'CA',
      zip: '94117',
      country: 'US',
      email: 'shippotle@goshippo.com',
      validate: true
    };

    this.apiService.validateAddress(address1).subscribe(
      ({ address }) => {
        console.log(address);
        if (address.validation_results.is_valid) {
          console.log('It\'s valid, neat');
        }
      }
    );
  }

  // simply refunds a label
  createRefund(transactionId: string) {
    this.apiService.createRefund(transactionId).subscribe(
      ({ label }) => {
        console.log(label);
      }
    );
  }
}
