import { Injectable, AfterViewInit, HostListener  } from '@angular/core';
import {CollectionsService} from '@app/shared/services/collections.service'; 

import * as D3 from 'd3';
import * as D3Zoom from 'd3-zoom';


@Injectable({
    providedIn: 'root'
  })

export class ScatterPlotService {
    private margin:{top:number,right:number,bottom:number,left:number} = {top: 0, right: 0, bottom: 0, left: 0}
    private xAxis;
    private yAxis;
    private yValues; 
    private xValues;
    private svg;
    private zoomSection;
    private points;
    private data;
    //Need to be accessed by topic list to render position of labels
    private new_xScale:d3.ScaleLinear<number,number>;
    private new_yScale:d3.ScaleLinear<number,number>;
    private new_zScale:d3.ScaleLinear<number,number>;
    public circle_color = '#43EFC4';
    private conclusion_color = '#FD5F00';
    private abstract_color = '#43FFC4';
    public circle_opacity = 0.5;
    private circle_stroke_color = '#43EFC4';

    constructor(private collectionsService:CollectionsService){ }
    
      buildSVG(type:string){
        D3.selectAll('.' + type + '_scatterplot_svg').remove();
        let selector = D3.select('#' + type + '_scatterplot_card')
        this.svg = selector.append('svg')
            .attr('viewBox', "0 0 " + 600 + " " + 600)
            .attr('width', '100%')
            // .attr('height',(window.innerHeight - 107) + 'px')
            .attr('id', type + '_scatterplot_svg')
            .attr('transform','translate(' + this.margin.left + ',' + this.margin.top + ')')
        //Create Tooltip
        let tooltip = D3.select('#' + type + '_tooltip')
          .attr('class',type +'tooltip mat-card')
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
          .call(D3.drag())
        //Create Zoom Section
        this.zoomSection = this.svg
            .append('g')
            .attr('id',type + 'zoom_section')
      }
    
      axisZoom(type,data,data_size,XScale,YScale,ZScale){
        let svgData = D3.select('#' + type + 'zoom_section')
                  console.log(D3.event.transform)
                  svgData.attr('transform',D3.event.transform);
    
                  // create new scale ojects based on event
                  // this.new_xScale = D3.event.transform.rescaleX(XScale);
                  // this.new_yScale = D3.event.transform.rescaleY(YScale);
                  // this.new_zScale = D3.event.transform.rescaleZ(ZScale);

                  // //Update points
                  this.points.data(data)
                  //   .attr('cx', (d) => {return this.new_xScale(d.x)})
                  //   .attr('cy', (d) => {return this.new_yScale(d.y)})
                  //   .attr('r',(d) => {return this.new_zScale(d[data_size])})
                  // let selectlabels = D3.selectAll('.scatterPlot_labels')
                  //   .attr('transform',D3.event.transform)
      }
    
    getMaxX(data) {
        let data_elements = [];
        if(data){
            data.forEach((input_data) => {
                data_elements.push(input_data['x']);
            });
            return D3.max(data_elements);
        }
    }
    
    getMinX(data) {
        let data_elements = [];
        if(data){
            data.forEach((input_data) => {
                data_elements.push(input_data['x']);
            });
            return D3.min(data_elements);
        }
    }
    
    getMaxY(data) {
        let data_elements = [];
        if(data){
            data.forEach((input_data) => {
                data_elements.push(input_data['y']);
            });
            return D3.max(data_elements);
        }
    }
    
    getMinY(data) {
        let data_elements = [];
        if(data){
            data.forEach((input_data) => {
                data_elements.push(input_data['y']);
            });
            return D3.min(data_elements);
        }
    }

    getMaxZ(data,parameter) {
        let data_elements = [];
        if(data){
            data.forEach((input_data) => {
                data_elements.push(input_data[parameter]);
            });
            return D3.max(data_elements);
        }
    }

    getMinZ(data,parameter){
        let data_elements = [];
        if(data){
            data.forEach((input_data) => {
                data_elements.push(input_data[parameter]);
            });
            return D3.min(data_elements);
        }
    }
    
    populate(type, data, identifier:string, data_size:string, XScale, YScale, ZScale ,tooltip_title,tooltip_subtitle0,tooltip_subtitle1,tooltip_subtitle2,tooltip_text){
      this.data = data;
       this.svg =  D3.select('#' + type + '_scatterplot_svg').call(D3Zoom.zoom()
            // .translateExtent([[20, 20], [400, 400]])
            .extent([[20, 20], [400, 400]])
            .on("zoom",() => {
                this.axisZoom(type,data,data_size,XScale,YScale,ZScale)
            }))
       this.svg.on('click',(d)=>{
              // let pos = D3.mouse(D3.event.currentTarget);
              // let posX = pos[0]; 
              // let posY = pos[1];
              // let posXScale = XScale(posX)
              // let posYScale = YScale(posY)
              // console.log(d);
              D3.select('.' + type +'tooltip')
                .transition()
                .duration(1)
                .style('display','none')
        })
      this.zoomSection = D3.select('#'+ type + 'zoom_section');
    
      let classRef = this;
      if (data){
          XScale.domain([this.getMinX(data),this.getMaxX(data)]);
          YScale.domain([this.getMinY(data),this.getMaxY(data)]);
          ZScale.domain([this.getMinZ(data,data_size),this.getMaxZ(data,data_size)]);
          // this.zScale.domain([0,this.getMaxZ()]);
          this.points =this.zoomSection.selectAll('.dot')
              .data(data);

          let deleted_points = this.points.exit();

          let new_points = this.points.enter();

          
          new_points.append('circle')
                  .attr('id', (d) => 'id_' + d['key'])
                  .attr('class',(d) => {
                      let class_type;
                    if(type=='sections'){
                        class_type = 'dot class_'+ d.document
                    }else{
                        class_type = 'dot class_'+ d.key 
                    }
                    return class_type;
                  })
                  .attr('r', (d) => 5)
                  .style('fill','white')
                  .style('opacity',this.circle_opacity)
                  .on('mouseover', (d) => {
                      D3.selectAll('.' + 'class_'+ d.key)
                        .transition()
                        // .attr('r', (d) => d[data_size])
                        .duration(1)
                        .style('opacity',0.6)
                        .style('fill','#f5d6d4')
                      //Tooltip size and position
                      D3.select('.' + type +'tooltip')
                      .transition()
                      .duration(1)
                      .style('display','block')
                      // .style('position','absolute')
                      // .style("left", (D3.event.pageX - document.getElementById(type + '_scatterplot_svg').getBoundingClientRect()['x']) + "px")		
                      // .style("top",  (D3.event.pageY - document.getElementById(type + '_scatterplot_svg').getBoundingClientRect()['y']) + "px")
                      //Tooltip Populate Content
                      D3.select('.' + type +'tooltip')
                      .html(
                        '<mat-card-header><div style="text-align: right;">' + d[data_size].toFixed(0) +'</div>' +
                          '<mat-card-title id: "tooltip_title" class:"mat-card-title style="font-size: 14px;"> <b>'  +  d[tooltip_title] + '</b> </mat-card-title> <br> <br>' +
                          '<mat-card-subtitle style="font-size: 13px;">' + d[tooltip_subtitle0] + '; ' + d[tooltip_subtitle1] + '; ' + d[tooltip_subtitle2] + '</mat-card-subtitle> ' +
                          '</mat-card-header> <br> <br>' +
                          '<mat-card-content style="font-size: 11px;"><div id="tooltip_content" style="text-align: justify; overflow-y:scroll; margin-right: -27px;padding-right:25px">' + d[tooltip_text] + '</div></mat-card-content>'
                        )
                        D3.select('#tooltip_content')
                        .style('max-height', (window.innerHeight/2 - 107) + 'px')
                      //Hide other topics.
                      // d.topics.forEach((paperTopic)=>{
                      //   console.log(paperTopic);
                      //   D3.select('#topicCard-' + paperTopic)
                      //     .style('display','initial')
                      // })
                })
                .on('mouseout', (d) => {
                  // D3.select('.' + type +'tooltip')
                  //     .transition()
                  //     .duration(1)
                  //     .style('display','none')
                  D3.selectAll('.' + 'class_'+ d.key)
                      .transition()
                      .duration(1)
                      .style('fill', (d) => {
                        let color;
                          if(d['new']){
                              color = this.conclusion_color;
                          }else{
                            color = this.circle_color;
                          }
                        return color;
                      })
                      .style('opacity',this.circle_opacity)
                    //If topic not selected return to value
                    // if(d.isSelected !== true){
                    //   D3.selectAll('.' + this['className']['baseVal'].split(' ')[1])
                    // //   .attr('stroke-width','0')
                    //   .transition()
                    //   .duration(1)
                    // //   .attr('r', (d) => d[data_size])
                    //   .style('fill',this.circle_color)
                    //   .style('opacity',this.circle_opacity)
                    // }else{
                    //   D3.selectAll('.' + this['className']['baseVal'].split(' ')[1])
                    //   .transition()
                    //   .duration(1)
                    // //   .style('stroke-width','0')
                    //   .style('opacity',0.3)
                    // }         
                })
                .on('click',(d)=>{
                  this.svg.style('pointer-events','none')
                  this.zoomSection.style('pointer-events','auto')
                })
                .call(D3.drag()
                  .on("start", this.dragstarted)
                  .on("drag", (d) => { this.dragged(d,XScale,YScale) })
                  .on("end", (d) => { this.dragended(d,XScale,YScale)}));
         //Needs setTimeout for animation to be called
         setTimeout(() => {
          console.log(this.points)
          this.points.transition().duration(5000)
          .attr('id', (d) => 'id_' + d['key'])
                  .attr('class',(d) => {
                      let class_type;
                    if(type=='sections'){
                        class_type = 'dot class_'+ d.document
                    }else{
                        class_type = 'dot class_'+ d.key 
                    }
                    return class_type;
                  })
          .attr('cx', (d) => XScale(d['x']))
          .attr('cy', (d) => YScale(d['y']))
          .attr('r', (d) => ZScale(d[data_size]))
          .style('fill', (d) => {
            let color;
              if(d.new){
                  color = this.conclusion_color;
              }else{
                color = this.circle_color;
              }
            return color;
          })
          .style('opacity', this.circle_opacity)
          .style('cursor','pointer');

          
          new_points
          .attr('id', (d) => 'id_' + d['key'])
                  .attr('class',(d) => {
                      let class_type;
                    if(type=='sections'){
                        class_type = 'dot class_'+ d.document
                    }else{
                        class_type = 'dot class_'+ d.key 
                    }
                    return class_type;
                  })
            .attr('cx', (d) => XScale(d['x']))
            .attr('cy', (d) => YScale(d['y']))
            .attr('r', (d) => ZScale(d[data_size]))
            .style('fill', (d) => {
              let color;
                if(d.new){
                    color = this.conclusion_color;
                }else{
                  color = this.circle_color;
                }
              return color;
            })
            .style('opacity', this.circle_opacity)
            .style('cursor','pointer')

          deleted_points.transition().duration(5000)
          .attr('r', (d) => 0)
          .remove()
         },0);
      }
    }
    //FUNCTIONS THAT MANAGE DRAGGING
    dragstarted(d){
      console.log('start')
      let this_circle = D3.select('#'+'id_' + d.key)
      this_circle.raise()
        .attr("stroke","white")
      console.log(D3.event.x)
      console.log(D3.event.y)
      console.log('start')
    }

    dragged(d,XScale,YScale){
      // console.log('dragged')
      let this_circle = D3.select('#'+'id_' + d.key)
      // console.log(this_circle.attr('cx'))
      // console.log(this_circle.attr('cy'))
      // console.log(D3.event.x)
      // console.log(D3.event.y)
      const x = Number(this_circle.attr('cx')) + D3.event.dx;
      const y = Number(this_circle.attr('cy')) + D3.event.dy;
      this_circle.attr('cx',  x)
      this_circle.attr('cy',  y)
      // console.log('dragged')
    }

    dragended(d,XScale,YScale){
      console.log('ended')
      //Select Circle
      let this_circle = D3.select('#'+'id_' + d.key)
      this_circle.attr("stroke",null)
      //Update value in database
      let new_x = XScale.invert(parseFloat(this_circle.attr('cx')))
      let new_y = YScale.invert(parseFloat(this_circle.attr('cy')))
      this.collectionsService.update_position(d,new_x,new_y);
      //SetUp the original mouse-events
      this.svg.style('pointer-events','auto')
      this.zoomSection.style('pointer-events','auto')
    }
}