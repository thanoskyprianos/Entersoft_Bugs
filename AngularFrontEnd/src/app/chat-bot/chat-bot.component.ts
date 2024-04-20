import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component'
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component'
import { NgIf} from '@angular/common'

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [
    RouterLink, 
    HeaderComponent, 
    ChatBubbleComponent,
    NgIf
  ],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {
  url = "http://localhost:8000"
  toSent: string = ''

  messages: string[] = []
  recording: boolean = false;

  onEnter(event: any) {
    this.toSent = event.target.value;


    if (this.toSent.length === 0) {
      return;
    }

    this.messages.unshift(this.toSent);
    console.log(this.toSent);

    event.target.value = '';
  }

  startRecording() {
    this.recording = true;

    console.log(this.recording)
  }

  stopRecording() {
    this.recording = false;

    console.log(this.recording)
  }
}
