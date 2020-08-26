import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-billetera',
  templateUrl: './billetera.page.html',
  styleUrls: ['./billetera.page.scss'],
})
export class BilleteraPage implements OnInit {


  total: number =0;
  metodosPago: Object;
  saldo:number =10;
  user: any;
  method;
  quantity=0;
  carga:boolean = false;
  view = "lista";
  foto:File = null;
  fotoSeleccionada: string | ArrayBuffer;



  transactions =[];


  constructor(private dbService: DbService, private token: TokenService) {

    this.user=this.token.GetPayLoad().usuario;
   }


   fileUpl(files: FileList)
   {
     const reader = new FileReader();
     reader.onload = e => this.fotoSeleccionada = reader.result;
     reader.readAsDataURL(files[0]);
 
     this.foto= files.item(0);
     console.log(this.foto);
 
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

  // https://mobbex.com/p/payment_code/gen/dGzJ9O3P8
  ngOnInit() {

    this.TraerTransaction();
    this.TraerMetodosPago();
  }

}
