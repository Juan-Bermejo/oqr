import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DbService } from '../services/db.service';
import { TokenService } from '../services/token.service';
import { setInterval } from 'timers';


@Component({
  selector: 'app-billetera',
  templateUrl: './billetera.page.html',
  styleUrls: ['./billetera.page.scss'],
})


export class BilleteraPage implements OnInit {

  @ViewChild('mpForm',{static:false}) mpForm: ElementRef;
  
  globalId: string;
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

   // Link externo
  goToLinkE() {

    let data = {

      "quantity": this.quantity
    }

    this.dbService.pago(data).toPromise().then((data:any)=>
    {
      console.log(data);
  
      if(data.ok)
      {
        this.globalId = data.pago.init_point;
        window.open(this.globalId, '_system');
      }
    })

    
  }
// Link interno
  goToLink(url: string) {
    window.open(url, '_blank');
  }


   fileUpl(files: FileList)
   {
     const reader = new FileReader();
     reader.onload = e => this.fotoSeleccionada = reader.result;
     reader.readAsDataURL(files[0]);
 
     this.foto= files.item(0);
     console.log(this.foto);
 
   }



  // pagar()
  // {
  //   this.dbService.pago().subscribe(data=>
  //     {
  //       console.log(data);
  //     })
  // }

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


  // TraerMetodosPago()
  // {
  //   this.dbService.apipagos().subscribe((data:any)=>
  // {
  //   console.log(data)
  //   if(data.result)
  //   {
  //     this.metodosPago = data.data;
  //   }
    
  // })
  // }

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

    //this.TraerTransaction();
   // this.TraerMetodosPago();
  //  setInterval(()=>
  //  {
  //   this.TraerTransaction();
  //  }, 10000)

  }

  ionViewWillEnter()
  {
    this.TraerTransaction();
    
  }


  enviarTicket()
  {

  }

}
