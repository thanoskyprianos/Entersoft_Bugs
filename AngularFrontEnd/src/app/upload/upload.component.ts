import { Component } from '@angular/core';
import { RouterLink } from '@angular/router'
import { HeaderComponent } from '../header/header.component'
import { DragAndDropComponent } from '../drag-and-drop/drag-and-drop.component'

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [RouterLink, HeaderComponent, DragAndDropComponent],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {

}
