import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pay-return',
  templateUrl: './pay-return.page.html',
  styleUrls: ['./pay-return.page.scss'],
})
export class PayReturnPage implements OnInit {
  status:any
  type:any
  transactionId:any
  constructor(private activatedRoute: ActivatedRoute) {
/*
    this.status=this.navParams.get('status');
    this.type=this.navParams.get('type');
    this.transactionId=this.navParams.get('transactionId');
    */
   }

  ngOnInit() {
    this.status = this.activatedRoute.snapshot.paramMap.get("status");
    console.log(this.status)
  }

}
