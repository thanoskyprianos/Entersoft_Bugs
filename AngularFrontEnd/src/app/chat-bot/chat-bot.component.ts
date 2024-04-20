import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component'

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [RouterLink, HeaderComponent],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css'
})
export class ChatBotComponent {

}
