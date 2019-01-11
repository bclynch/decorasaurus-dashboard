import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { OrderService } from 'src/app/services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  // orders props
  orders;
  displayedColumns: string[] = ['status', 'id', 'shipping', 'items', 'date'];
  dataSource;
  pageSizeOptions = [25, 50, 100];
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.orderService.getAllOrders().subscribe(
      (orders) => {
        this.orders = orders.map((order) => ({ status: order.status, id: order.id, shipping: order.shipping, items: order.orderItemsByOrderId.totalCount, date: order.createdAt }) );
        this.dataSource = new MatTableDataSource(this.orders);
        console.log(this.orders);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    );
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
