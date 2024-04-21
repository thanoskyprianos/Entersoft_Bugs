import { Component, booleanAttribute } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent } from '../header/header.component'
import { ChatBubbleComponent } from '../chat-bubble/chat-bubble.component'
import { NgIf } from '@angular/common'
import { HttpServiceService } from '../http-service.service';

import * as RecordRTC from 'recordrtc';
import { DomSanitizer } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [
    RouterLink, 
    HeaderComponent, 
    ChatBubbleComponent,
    NgIf,
    FormsModule,
  ],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.css',
  providers: [
    HttpServiceService
  ]
})
export class ChatBotComponent {
  url: string = '';
  djangoUrl = "http://localhost:8000"

  record: RecordRTC.StereoAudioRecorder;
  error: any;

  message: string;
  messages: string[] = []
  recording: boolean = false;
  processing: boolean = false;

  prompt = '';

  constructor (
    private domSanitizer: DomSanitizer, 
    private httpService: HttpServiceService,
  ) { }

  onEnter() {
    let toSent = this.prompt;

    if (toSent.length === 0) {
      return;
    }

    console.log(`To sent: ${toSent}`)

    this.messages.unshift(toSent);
    console.log(toSent);

    this.prompt = '';

    this.processing = true;

    let response = this.httpService.sendText(toSent);
    response.subscribe((message) => {
      this.message = message;
      this.update();
    });
  }

  update() {
    this.processing = false;

    if (this.message.length === 0) return

    this.messages.unshift(this.message);

    console.log(this.message);
  }

  startRecording() {
    if (this.processing)
      return

    this.url = ''
    this.recording = true;
    let mediaConstraints = {
      video: false,
      audio: true,
    };

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(this.successCallback.bind(this), this.errorCallback.bind(this));

    console.log(this.recording)
  }

  stopRecording() {
    this.recording = false;

    this.record.stop(this.processRecording.bind(this));

    console.log(this.recording)
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  successCallback(stream: any) {
    let mimeType: "audio/wav" = "audio/wav";
    let numberOfAudioChannels: 1 = 1;
    let type: 'audio' = 'audio';

    var options = {
      type: type,
      mimeType: mimeType,
      numberOfAudioChannels: numberOfAudioChannels,
      sampleRate: 44100,
    };

    // Start recording
    this.record = new RecordRTC.StereoAudioRecorder(stream, options);
    this.record.record();
  }

  processRecording(blob: Blob) {
    this.url = URL.createObjectURL(blob);
    console.log("blob", blob);
    console.log("URL", this.url);

    this.processing = true;

    let response = this.httpService.sendAudio(blob);
    response.subscribe((message) => {
      this.message = message;
      this.updateAudio();
    });
  }

  updateAudio() {
    if (this.message.length === 0) return

    this.messages.unshift(this.message);

    console.log(this.message);

    let response = this.httpService.sendText(this.message);
    response.subscribe((message) => {
      this.message = message;
      this.update();
    })
  }

  errorCallback(error: any) {
    this.error = 'Cannot play audio in your browser';
  }

  ngOnInit() { }
}
