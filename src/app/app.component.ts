import { Component } from '@angular/core';

import {CollectionsService} from '@app/shared/services/collections.service'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'zotAngular-app';

  constructor(private collectionsService:CollectionsService){ }

  //Function to send message to SageBrain to search for additional Papers
  searchArxiv(){
    this.collectionsService.search_arxiv();
  }

  updateModel(){
    this.collectionsService.update_model();
  }

  addDocuments(){
    this.collectionsService.addDocuments();
  }
}
