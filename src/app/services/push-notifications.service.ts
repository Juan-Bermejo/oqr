import { Injectable, EventEmitter } from '@angular/core';
import { OneSignal, OSNotification, OSNotificationPayload } from '@ionic-native/onesignal/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  paginaPushs = 0;

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el body de la push',
    //   date: new Date()
    // }
  ];

  userId: string;

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private platform: Platform,
    private oneSignal: OneSignal,
    private http: HttpClient,
  ) { }


  async configuracionInicial() {
    if (this.platform.is('cordova')) {
      this.platform.ready().then(() => {


        // this.oneSignal.startInit('9c481d59-483d-4cae-9350-05c18f06b2d2', '958724668266');
        this.oneSignal.startInit('f0898194-7645-4ae3-8dfd-1b9de2d1d6ee', '958724668266');

        // ! this.oneSignal.enableSound(false);
        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

        this.oneSignal.handleNotificationReceived().subscribe((noti) => {
          // do something when notification is received
          // console.log('Notificación recibida', noti);
          this.notificacionRecibida(noti);
        });

        this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
          // do something when a notification is opened
          // console.log('Notificación abierta', noti);
          await this.notificacionRecibida(noti.notification);
        });


        // Obtener ID del suscriptor
        this.oneSignal.getIds().then(info => {
          this.userId = info.userId;

        });

        this.oneSignal.endInit();

      });
    }
  }

  clearNoti() {
    this.oneSignal.clearOneSignalNotifications();
  }

  async getUserIdOneSignal() {
    // Obtener ID del suscriptor
    const info = await this.oneSignal.getIds();
    this.userId = info.userId;
    return info.userId;
  }

  async notificacionRecibida(noti: OSNotification) {

    const payload = noti.payload;

    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID);

    if (existePush) {
      return;
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);



  }





}

