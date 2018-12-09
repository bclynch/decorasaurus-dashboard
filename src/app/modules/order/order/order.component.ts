import { Component, OnInit } from '@angular/core';
import { SubscriptionLike } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { MatTableDataSource } from '@angular/material';

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
    private orderService: OrderService
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

}
