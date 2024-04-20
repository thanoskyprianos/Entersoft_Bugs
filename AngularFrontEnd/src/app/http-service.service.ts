import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  private url = 'http://localhost:8000/'

  constructor(private http: HttpClient) { }

  sendCSVData(dataType: string, files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        const formData = new FormData();

        formData.append('file', file, droppedFile.relativePath);
        formData.append('type', dataType);

        const resp = this.http.post(`${this.url}/csv/`, formData, {responseType: 'text'});
        resp.subscribe((message) => { console.log(message); });
      });
    }
  }

  sendAudio(blob: Blob): Observable<string> {
    const formData = new FormData();
    formData.append('blob', blob);

    return this.http.post(`${this.url}/audio/`, formData, {responseType: 'text'});
  }

  sendText(text: string): Observable<string> {
    const formData = new FormData();
    formData.append('prompt', text);

    return this.http.post(`${this.url}/text/`, formData, {responseType: 'text'});
  }
}
