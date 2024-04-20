import { Component } from '@angular/core';
import { NgxFileDropModule, NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpServiceService } from '../http-service.service'

@Component({
  selector: 'app-drag-and-drop',
  standalone: true,
  imports: [NgxFileDropModule],
  templateUrl: './drag-and-drop.component.html',
  styleUrl: './drag-and-drop.component.css',
  providers: [HttpServiceService]
})
export class DragAndDropComponent {
  dataType: string = '';

  constructor(private httpService: HttpServiceService) { }

  public dropped(files: NgxFileDropEntry[]) {
    console.log(files);

    this.httpService.sendCSVData(this.dataType, files);
  }

  public fileOver(event: any){
    console.log(event);
  }

  public fileLeave(event: any){
    console.log(event);
  }

  onSelected(type: string) {
    this.dataType = type;
  }
}
