import { Component, OnInit, ElementRef, ChangeDetectorRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import {ScatterPlotService} from '@app/shared/services/scatterplot.service';
import { Paper_Item } from '@app/shared/classes/paper';

import * as D3 from 'd3';

@Component({
  selector: 'app-simple-scatterplot',
  templateUrl: './simple-scatterplot.component.html',
  styleUrls: ['./simple-scatterplot.component.css']
})
export class SimpleScatterplotComponent implements OnChanges {

  private width: number = 600;  
  private height: number = 569;
  // private data: Array<Paper_Item> = []
  public xScale:d3.ScaleLinear<number,number>;
  public yScale:d3.ScaleLinear<number,number>;
  public zScale:d3.ScaleLinear<number,number>;
  
  
  loading:boolean = true;
  not_started:boolean = true;
  
  @Input() data: Array<Paper_Item>

  @ViewChild('svgContainer') svgContainer: ElementRef;

  //Scatterplot Stuff
  private svg;
  private dataCircles;
  private x_value;
  private y_value;
  private type:string=''
  public circle_opacity = 0.7;

  constructor(private _element: ElementRef, private scatterPlotService:ScatterPlotService, private changeDetectorRef:ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
      this.setup(); //Need to move this to ngOninit to run only once
      if(changes.data.currentValue){
        this.data = changes.data.currentValue.data;
        if(changes.data.currentValue.type === 0){
          this.x_value = 'xUmap'
          this.y_value = 'yUmap'
          this.type ='umap'
        }else{
          this.x_value = 'x'
          this.y_value = 'y'
          this.type='tsne'
        }
        this.scatterPlotService.buildSVG('paper');
        if (this.data.length > 0){
            this.loading = false;
            this.changeDetectorRef.detectChanges();
            this.buildSVG();
            this.drawSvg();
        }
      }
    }

    setup(){
      this.xScale =  D3.scaleLinear().range([20,this.svgContainer.nativeElement.width.baseVal.value-30]);
      this.yScale = D3.scaleLinear().range([this.svgContainer.nativeElement.height.baseVal.value-30,20]);
      this.zScale = D3.scaleLinear().range([10,15]);
    }

    buildSVG(){
      this.svg = D3.select(this.svgContainer.nativeElement);
      this.svg.attr('width', '100%')
              .attr('height', '100%')
              .attr('class','static-scatterplot')
    }
  
    drawSvg(){
      // this.scatterPlotService.populate('paper',this.data,'key','weight',this.xScale,this.yScale,this.zScale,'title','author1','author2','author3','abstract_text');
      let type = this.type;
      if(this.x_value==='xUmap'){
        this.xScale.domain([this.scatterPlotService.getMinX(this.data,'umap'),this.scatterPlotService.getMaxX(this.data,'umap')]);
        this.yScale.domain([this.scatterPlotService.getMinY(this.data,'umap'),this.scatterPlotService.getMaxY(this.data,'umap')]);
      }else{
        this.xScale.domain([this.scatterPlotService.getMinX(this.data),this.scatterPlotService.getMaxX(this.data)]);
        this.yScale.domain([this.scatterPlotService.getMinY(this.data),this.scatterPlotService.getMaxY(this.data)]);
      }
      this.zScale.domain([this.scatterPlotService.getMinZ(this.data,'weight'),this.scatterPlotService.getMaxZ(this.data,'weight')]);
      this.dataCircles = this.svg.selectAll('.dot')
                                 .data(this.data)
                                 .enter()
                                 .append('circle')
                                 .attr('class',(d) => 'class_' + d.key)
                                 .attr('cx', (d) => this.xScale(d[this.x_value]))
                                 .attr('cy', (d) => this.yScale(d[this.y_value]))
                                 .attr('r', (d) => this.zScale(d['weight']))
                                 .style('fill','#4666FF')
                                 .on('mouseover', (d) => {
                                    D3.selectAll('.' + 'class_'+ d.key)
                                      .transition()
                                      .duration(1)
                                      .style('opacity',this.circle_opacity)
                                      .style('fill','#f5d6d4') 
                                    D3.select('.tooltip')
                                      .transition()
                                      .duration(1)
                                      .style('display','block')
                                    D3.select('.tooltip')
                                        .html(
                                          '<mat-card-title style="font-size: 14px;"> <b>'  +  d['title'] + '</b> </mat-card-title> <br> <br>' +
                                          '<mat-card-subtitle style="font-size: 13px;">' + d['author1'] + '; ' + d['author2'] + '; ' + d['author3'] + '</mat-card-subtitle> ' +
                                          '</mat-card-header> <br> <br>' +
                                          '<mat-card-content style="font-size: 11px;"><div style="text-align: justify; overflow-y:scroll; margin-right: -27px;padding-right:25px">' + d['abstract_text'] + '</div></mat-card-content>'
                                            )
                                  })
                                  .on('mouseout', (d) => {
                                    D3.selectAll('.' + 'class_'+ d.key)
                                        .transition()
                                        .duration(1)
                                        .style('fill', (d:any) => {
                                          let color;
                                          color = '#4666FF';
                                          return color;
                                        })
                                        .style('opacity',this.circle_opacity) 
                                  })
                                  
      //Create Tooltip
      let tooltip = D3.select('#' + this.type + 'tooltip')
      .attr('class',this.type + 'tooltip mat-card')
      .style('background','rgba(53, 93, 98,0.5)')
      .style('display','none')
      .style('max-width','277px')
      .style('padding','10px')
      .style('padding-bottom','10px')
      .style('color','rgba(255, 255, 255,1)')
      .style('text-align','center')
      .style('position','absolute')
      .style('left','0px')
      .style('top','50px')
      .style('overflow',  'hidden')
      .style('z-index',1)
    }
  
    startStudy(){
      this.not_started = false;
      this.loading =true;
      // this.collectionsService.startStudy();
    }
  
    // nextStep(){
    //   this.loading = true;
    //   this.changeDetectorRef.detectChanges();
    //   // this.collectionsService.update_model();
    //   // this.collectionsService.addDocuments();
    //   this.changeDetectorRef.detectChanges();
    // }

}
