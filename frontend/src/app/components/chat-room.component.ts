import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatMessage, ChatService } from '../services/chat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.css']
})
export class ChatRoomComponent implements OnInit, OnDestroy {
  form: FormGroup
  text: string = 'Join'

  messages: ChatMessage[] = []
  event$: Subscription

  constructor(private fb: FormBuilder, private chatSvc: ChatService) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      message: ['']
    })
  }

  ngOnDestroy() {
    // check if we are connected before unsubscribing
    if (null != this.event$) {
      this.event$.unsubscribe()
      this.event$ = null
    }
  }

  toggleConnection() {
    const name = this.form.get(['name']).value
    if (name != null) {
      if (this.text == 'Join') {
        this.text = 'Leave'
        this.chatSvc.join(name)
        this.event$ = this.chatSvc.event.subscribe(
          (chat) => {
            this.messages.unshift(chat)
          }
        )
      } else {
        this.text = 'Join'
        this.chatSvc.leave()
        this.event$.unsubscribe()
        this.event$ = null
      }
    } else {

    }

  }

  sendMessage(){
    const message = this.form.get('message').value
    console.info(`Message: ${message}`)
    this.form.get('message').reset()
    this.chatSvc.sendMessage(message)
  }
}
