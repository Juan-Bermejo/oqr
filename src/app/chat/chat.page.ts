import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';
import { Chat } from '../clases/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {

  array_chats: Chat[];

  constructor(private dbServ: DbService) {
    
   }

  ngOnInit() {
  }

}
