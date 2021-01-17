import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatService } from './services/chat.service';
import { ChatRoomComponent } from './components/chat-room.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatRoomComponent
  ],
  imports: [
    BrowserModule,
    FormsModule, ReactiveFormsModule
  ],
  providers: [
    ChatService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
