import { Component, OnInit } from '@angular/core';

import {CollectionsService} from '@app/shared/services/collections.service';
import { Router } from '@angular/router';


// import {SimpleScatterplotComponent} from '../../components/simple-scatterplot/simple-scatterplot.component'

@Component({
  selector: 'app-scatterplot-comparison-page',
  templateUrl: './scatterplot-comparison-page.component.html',
  styleUrls: ['./scatterplot-comparison-page.component.css']
})
export class ScatterplotComparisonPageComponent implements OnInit {

  data1:any;
  data2:any;

  constructor(private router: Router, private collectionsService:CollectionsService,) { }

  ngOnInit() {
    //Subscribe
    this.collectionsService.comparison_papers.subscribe(newData =>{
      this.data1 = {
        'data':newData,
        'type':0
      }
      this.data2 = {
        'data':newData,
        'type':1
      }
    })
  }

  nextStep(){
    // this.collectionsService.addDocuments();
    this.collectionsService.nextCicle();
    this.router.navigate(['/dashboard']).then(e => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

}
