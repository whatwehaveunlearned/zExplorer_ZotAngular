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
  type1:Number;
  data2:any;
  type2:Number

  constructor(private router: Router, private collectionsService:CollectionsService,) { }

  ngOnInit() {
    //Randomize Graphs
    this.type1 = Math.round(Math.random());
    if(this.type1 === 0){
      this.type2 = 1;
      console.log('Left is UMAP')
      console.log('Right is Our Model')
    }else{
      this.type2 = 0;
      console.log('Left is Our Model')
      console.log('Right is Umap')
    }
    //Subscribe
    this.collectionsService.comparison_papers.subscribe(newData =>{
      this.data1 = {
        'data':newData,
        'type':this.type1
      }
      this.data2 = {
        'data':newData,
        'type':this.type2
      }
    })
  }

  nextStep(){
    // this.collectionsService.addDocuments();
    this.collectionsService.nextCicle();
    this.router.navigate(['/dashboard']).then(e => {
      // if (e) {
      //   console.log("Navigation is successful!");
      // } else {
      //   console.log("Navigation has failed!");
      // }
    });
  }

}
