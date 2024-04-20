import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-chat-bubble',
  standalone: true,
  imports: [],
  templateUrl: './chat-bubble.component.html',
  styleUrl: './chat-bubble.component.css'
})
export class ChatBubbleComponent {
  @Input() messageStr: string = '';
}
