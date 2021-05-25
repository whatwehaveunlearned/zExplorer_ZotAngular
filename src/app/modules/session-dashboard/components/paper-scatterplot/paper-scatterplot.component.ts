import { Component, OnInit, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from "@angular/router";
// import {DragDropModule} from '@angular/cdk/drag-drop';

import {CollectionsService} from '@app/shared/services/collections.service';
import {ScatterPlotService} from '@app/shared/services/scatterplot.service';
import { Paper_Item } from '@app/shared/classes/paper';

import * as D3 from 'd3';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-paper-scatterplot',
  templateUrl: './paper-scatterplot.component.html',
  styleUrls: ['./paper-scatterplot.component.css']
})
export class PaperScatterplotComponent implements OnInit {
  private width: number = 600;  
  private height: number = 569;
  private data: Array<Paper_Item> = []
  public xScale:d3.ScaleLinear<number,number>;
  public yScale:d3.ScaleLinear<number,number>;
  public zScale:d3.ScaleLinear<number,number>;
  loading:boolean = false;
  not_started:boolean = true;
  dataSubscription:Subscription;
  
  constructor(private router: Router, private collectionsService:CollectionsService,private _element: ElementRef, private scatterPlotService:ScatterPlotService, private changeDetectorRef:ChangeDetectorRef) { }

  ngOnInit() {
  //Fetch data
    // this.data = this.collectionsService.getSessionWords();
    // this.data =  this.collectionsService.getSessionPapers();
    // this.loading = true;
    this.setup();
    this.scatterPlotService.buildSVG('paper');
    if (this.data.length > 0){
      if(this.data['x'] !== -1000000){
        this.loading = false;
        this.drawSvg();
      }
    }
    // this.host = D3.select(this._element.nativeElement);
    
    //Subscribe
    this.dataSubscription = this.collectionsService.papers_dashboard.subscribe(newData =>{
      this.data = newData;
      if(this.data['x'] !== -1000000){
        this.not_started = false;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
        this.drawSvg();
      }
    })
  }

  setup(){
    this.xScale =  D3.scaleLinear().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height,0]);
    this.zScale = D3.scaleLinear().range([15,15]);
  }

  drawSvg(){
    this.scatterPlotService.populate('paper',this.data,'key','weight',this.xScale,this.yScale,this.zScale,'title','author1','author2','author3','abstract_text');
    // this.scatterPlotService.drawXAxis();
    // this.scatterPlotService.drawYAxis();
  }

  startStudy(){
    this.not_started = false;
    this.loading =true;
    this.collectionsService.startStudy();
  }

  nextStep(){
    this.loading = true;
    this.changeDetectorRef.detectChanges();
    this.collectionsService.update_model();
    // this.collectionsService.addDocuments();
    this.router.navigate(['/comparison']).then(e => {
      if (e) {
        console.log("Navigation is successful!");
      } else {
        console.log("Navigation has failed!");
      }
    });
  }

  ngOnDestroy(){
    this.dataSubscription.unsubscribe();
  }

  // resetZoom(){
  //   D3.select('#zoom_section')
  //     .attr('transform',"translate(0,0)scale(1)")
  //   D3.select('.x_axis').call(this.xAxis);
  //   D3.select('.y_axis').call(this.yAxis);
  // }

}
