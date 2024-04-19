import { Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { ChatBotComponent } from './chat-bot/chat-bot.component';
import { MainPageComponent } from './main-page/main-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/main', pathMatch: 'full'},
    { path: 'upload', component: UploadComponent, title: 'Upload Page' },
    { path: 'chatbot', component: ChatBotComponent, title: 'ChatBot Page' },
    { path: 'main', component: MainPageComponent, title: 'Main Page' }
];
