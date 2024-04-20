import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop'

@Injectable({
  providedIn: 'root'
})
export class HttpServiceService {
  private url = 'http://localhost:8000/db/'

  constructor(private http: HttpClient) { }

  saveData(dataType: string, files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {

          // Here you can access the real file
          // console.log(droppedFile.relativePath, file);

          // You could upload it like this:
          const formData = new FormData();
          formData.append('file', file, droppedFile.relativePath);
          formData.append('type', dataType);

          const resp = this.http.post(this.url, formData);
          resp.subscribe();
        });
    }
  }
}
