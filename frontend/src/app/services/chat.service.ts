import { Injectable } from "@angular/core";
import { HttpParams } from "@angular/common/http";
import { Subject } from "rxjs";

export interface ChatMessage {
    from: string
    message: string
    timestamp: string
}

@Injectable()
export class ChatService {

    private sock: WebSocket = null

    event = new Subject<ChatMessage>()

    sendMessage(msg: string) {
        this.sock.send(msg)
    }

    join(name: string) {
        const params = new HttpParams().set('name', name)
        const url = `ws://localhost:3000/chat?${params.toString()}`
        console.info('ws websocket: ', url)
        this.sock = new WebSocket(url)
        // handle incoming message
        this.sock.onmessage = (payload: MessageEvent) => {
            // parse the string to ChatMessage
            const chat = JSON.parse(payload.data) as ChatMessage
            this.event.next(chat)
        }
        // connection closes unexpectedly
        this.sock.onclose = (() => {
            if (this.sock != null) {
                this.sock.close()
                this.sock = null
            }
        })
    }

    // we leave by ourselves
    leave() {
        if (this.sock != null) {
            this.sock.close()
            this.sock = null
        }
    }
}