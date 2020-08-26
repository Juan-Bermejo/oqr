import { Component, OnInit } from '@angular/core';
import { DbService } from '../../services/db.service';
import { TokenService } from '../../services/token.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-billetera',
  templateUrl: './billetera.component.html',
  styleUrls: ['./billetera.component.scss'],
})
export class BilleteraComponent implements OnInit {

  total: number =0;
  metodosPago: Object;
  saldo:number =10;
  user: any;
  method;
  quantity=0;
  carga:boolean = false;



  transactions =[];


  constructor(private dbService: DbService,
    private modalCtrl:ModalController,
     private token: TokenService) {

    this.user=this.token.GetPayLoad().usuario;
   }

  pagar()
  {
    this.dbService.pago().subscribe(data=>
      {
        console.log(data);
      })
  }

  cargar()
  {
    let json ={
      quantity: this.quantity,
      currency: "ARS",
      method: this.method
    }

    this.dbService.cargarSaldo(json).subscribe((data:any)=>
  {
    console.log(data);
  })
  }


  TraerMetodosPago()
  {
    this.dbService.apipagos().subscribe((data:any)=>
  {
    console.log(data)
    if(data.result)
    {
      this.metodosPago = data.data;
    }
    
  })
  }

  TraerTransaction()
  {
    this.dbService.getTransactions().subscribe((data:any)=>
  {
    console.log(data)
    if(data.ok)
    {
      this.transactions = data.transactions;
      this.total = data.total;
      console.log(this.total)
    }
    
  })
  }


  dismissModal()
  {
    
    
    this.modalCtrl.dismiss({
 
      'dismissed': true
    })
  }

  // https://mobbex.com/p/payment_code/gen/dGzJ9O3P8
  ngOnInit() {

    this.TraerTransaction();
    this.TraerMetodosPago();
  }


}
