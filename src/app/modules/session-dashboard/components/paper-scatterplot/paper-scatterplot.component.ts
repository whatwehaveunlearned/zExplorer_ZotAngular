import { Component, OnInit, ElementRef, OnChanges, ViewEncapsulation } from '@angular/core';
// import {DragDropModule} from '@angular/cdk/drag-drop';

import {CollectionsService} from '@app/shared/services/collections.service';
import {ScatterPlotService} from '@app/shared/services/scatterplot.service';
import { Paper_Item } from '@app/shared/classes/paper';

import * as D3 from 'd3';

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
  
  constructor(private collectionsService:CollectionsService,private _element: ElementRef, private scatterPlotService:ScatterPlotService) { }

  ngOnInit() {
  //Fetch data
    // this.data = this.collectionsService.getSessionWords();
    // this.data =  this.collectionsService.getSessionPapers();
    this.setup();
    this.scatterPlotService.buildSVG('paper');
    if (this.data.length > 0){
      if(this.data['x'] !== -1000000){
        this.drawSvg();
      }
    }
    // this.host = D3.select(this._element.nativeElement);
    
    //Subscribe
    this.collectionsService.papers_in_session_updated.subscribe(newData =>{
      this.data = newData;
      if(this.data['x'] !== -1000000){
        this.drawSvg();
      }
    })
  }

  setup(){
    this.xScale =  D3.scaleLinear().range([0, this.width]);
    this.yScale = D3.scaleLinear().range([this.height,0]);
    this.zScale = D3.scaleLinear().range([5,20]);
  }

  drawSvg(){
    this.scatterPlotService.populate('paper',this.data,'key','weight',this.xScale,this.yScale,this.zScale,'title','author1','author2','author3','abstract_text');
    // this.scatterPlotService.drawXAxis();
    // this.scatterPlotService.drawYAxis();
  }

  // resetZoom(){
  //   D3.select('#zoom_section')
  //     .attr('transform',"translate(0,0)scale(1)")
  //   D3.select('.x_axis').call(this.xAxis);
  //   D3.select('.y_axis').call(this.yAxis);
  // }

}
