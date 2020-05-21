import { Injectable, AfterViewInit, HostListener, Inject,Component  } from '@angular/core';
import {CollectionsService} from '@app/shared/services/collections.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

import {Cluster} from '@app/shared/classes/cluster'; 
import {PaperScatterplotComponent} from '@app/modules/session-dashboard/components/paper-scatterplot/paper-scatterplot.component'

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
    private selected_data = [];
    //Need to be accessed by topic list to render position of labels
    private new_xScale:d3.ScaleLinear<number,number>;
    private new_yScale:d3.ScaleLinear<number,number>;
    private new_zScale:d3.ScaleLinear<number,number>;
    public circle_color = '#43EFC4';
    private conclusion_color = '#FD5F00';
    private abstract_color = '#43FFC4';
    public circle_opacity = 0.5;
    private circle_stroke_color = '#43EFC4';
    private cluster_array = [];

    constructor(private collectionsService:CollectionsService,public dialog: MatDialog){ }
    
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
          .style('z-index',1)
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
              //Unselect group
              D3.selectAll('.dot')
                .style('stroke',null)
                .classed('data_selected',false)
              this.selected_data = []
              //SetUp the original mouse-events
              this.svg.style('pointer-events','auto')
              this.zoomSection.style('pointer-events','auto')
        })
        //Cancel default double click behaviour for zoom. Dblclick is used to select data points
        this.svg.on("dblclick.zoom", null)
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
                      if(this.selected_data.length === 0 ){
                      D3.select('.' + type +'tooltip')
                      .html(
                        '<mat-card-header><div style="text-align: right;">' + d[data_size].toFixed(0) +'</div>' +
                          '<mat-card-title id: "tooltip_title" class:"mat-card-title style="font-size: 14px;"> <b>'  +  d[tooltip_title] + '</b> </mat-card-title> <br> <br>' +
                          '<mat-card-subtitle style="font-size: 13px;">' + d[tooltip_subtitle0] + '; ' + d[tooltip_subtitle1] + '; ' + d[tooltip_subtitle2] + '</mat-card-subtitle> ' +
                          '</mat-card-header> <br> <br>' +
                          '<mat-card-content style="font-size: 11px;"><div id="tooltip_content" style="text-align: justify; overflow-y:scroll; margin-right: -27px;padding-right:25px">' + d[tooltip_text] + '</div></mat-card-content>' +
                          '<div id="cluster_buttons"></div>'
                          )
                      }else{
                        D3.select('.' + type +'tooltip')
                          .html(
                            '<mat-card-header><div style="text-align: right;">' + d[data_size].toFixed(0) +'</div>' +
                              '<mat-card-title id: "tooltip_title" class:"mat-card-title style="font-size: 14px;"> <b>'  +  d[tooltip_title] + '</b> </mat-card-title> <br> <br>' +
                              '<mat-card-subtitle style="font-size: 13px;">' + d[tooltip_subtitle0] + '; ' + d[tooltip_subtitle1] + '; ' + d[tooltip_subtitle2] + '</mat-card-subtitle> ' +
                              '</mat-card-header> <br> <br>' +
                              '<mat-card-content style="font-size: 11px;"><div id="tooltip_content" style="text-align: justify; overflow-y:scroll; margin-right: -27px;padding-right:25px">' + d[tooltip_text] + '</div></mat-card-content>' +
                              '<div id="cluster_buttons"><button mat-button id="edit_cluster_button"><mat-icon>edit</mat-icon></button></div>'
                              )
                          .on('click', (d) => { this.editCluster(this.selected_data,XScale,YScale)})
                      }
                        D3.select('#tooltip_content')
                        .style('max-height', (window.innerHeight/2).toFixed(0) + 'px')
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
                      .style('fill', (d:any) => {
                        let color;
                          if(d['new']){
                              color = d.color;
                          }else{
                            color = d.color;
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
                .on("contextmenu",  (d) => {
                  //To avoid default left click functionality
                  D3.event.preventDefault();
                  // //For debugging purposes
                  // let test = this.selected_data;
                  // this.zoomSection.style('pointer-events','none')
                  // this.svg.style('pointer-events','none')
                  //We make the selection
                  let data_point = D3.select('#id_'+d.key)
                  
                  //We style selection and add or delete class
                  if(data_point.attr('class').split(' ').includes("data_selected")){
                    data_point.style('stroke',null)
                      .classed('data_selected',false)
                    //Remove from selection array
                    this.selected_data = this.selected_data.filter(papers => papers.key !== data_point.attr('id').split('_')[1])
                  }else{
                    data_point.style('stroke','white')
                      .style('stroke-width','4')
                      .classed('data_selected',true)
                    //If first selected data show menu
                    if(this.selected_data.length === 0){
                      //Tooltip Add footer buttons
                      D3.select('#cluster_buttons')
                        .html('<button mat-button id="edit_cluster_button><mat-icon>edit</mat-icon></button>')
                        .on('click', (d) => { this.editCluster(this.selected_data,XScale,YScale)})
                    }
                    //Store in selection array
                    this.selected_data.push(data.filter(papers => papers.key === data_point.attr('id').split('_')[1])[0])
                  }
                  // test = this.selected_data
                  // console.log('test')
                  this.svg.style('pointer-events','auto')
                  this.zoomSection.style('pointer-events','auto')
                })
                .on('click',(d)=>{
                  this.svg.style('pointer-events','none')
                  this.zoomSection.style('pointer-events','auto')
                })
                .call(D3.drag()
                  .on("start", this.dragstarted)
                  .on("drag", (d) => { this.dragged(d,XScale,YScale) })
                  .on("end", (d) => { this.dragended(d,XScale,YScale)}));
        //Edit Cluster callback
        D3.select("#edit_cluster_button > mat-icon")
              .on('click', (d) => {
                console.log('call')
                let dialogRef = this.dialog.open(ClusterDialog,{
                  width:'250px'
                });

                dialogRef.afterClosed().subscribe(result => {
                  console.log('The dialog was closed');
                  // this.animal = result;
                });
              })
        //NEW POINTS UPDATE
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
                color = d.color;
            }else{
              color = d.color;
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
                  color = d.color;
              }else{
                color = d.color;
              }
            return color;
          })
          .style('opacity', this.circle_opacity)
          .style('cursor','pointer')

        deleted_points.transition().duration(5000)
        .attr('r', (d) => 0)
        .remove()
        },0);
        //Update cluster tag if moved point in a cluster
        this.cluster_array.forEach(element =>{
          this.updateClusterTag(element,XScale,YScale)
        })
      }
    }
    //FUNCTIONS THAT MANAGE DRAGGING
    dragstarted(d){
      //This is done to allow unselected points to move with selection
      let data_element = D3.select('#id_'+d.key)
      if(data_element.attr('class').split(' ').includes("data_selected")){
        data_element.classed('data_was_selected',true)
      }else{
        data_element.classed('data_selected',true)
      }
      let this_circles = D3.selectAll('.'+'data_selected')
      this_circles.raise()
        .attr("stroke","white")
    }

    dragged(d,XScale,YScale){
      let this_circles:any = D3.selectAll('.'+'data_selected')
      for (let i=0;i<this_circles._groups[0].length;i++){
        let x = Number(D3.select(this_circles._groups[0][i]).attr('cx')) + D3.event.dx;
        let y = Number(D3.select(this_circles._groups[0][i]).attr('cy')) + D3.event.dy;
        D3.select(this_circles._groups[0][i]).attr('cx',  x)
        D3.select(this_circles._groups[0][i]).attr('cy',  y)
      }
    }

    dragended(d,XScale,YScale){
      console.log('ended')
      //Select Circle
      let this_circles:any = D3.selectAll('.'+'data_selected')
      this_circles.attr("stroke",null)
      //Update value in database
      for (let i=0;i<this_circles._groups[0].length;i++){
        let new_x = XScale.invert(parseFloat(D3.select(this_circles._groups[0][i]).attr('cx')))
        let new_y = YScale.invert(parseFloat(D3.select(this_circles._groups[0][i]).attr('cy')))
        this.collectionsService.update_position(d,new_x,new_y);
      }
      let data_element = D3.select('#id_'+d.key)
      //We do this to reset points that where not selected in the group to none again.
      if (data_element.attr('class').split(' ').includes("data_was_selected") === false){
        D3.select('#id_'+d.key).classed('data_selected',false) 
      }else{
        data_element.classed('data_was_selected',false)
      }

      //Update cluster tag if moved point in a cluster
      this.cluster_array.forEach(element =>{
        this.updateClusterTag(element,XScale,YScale)
      })
      //SetUp the original mouse-events
      this.svg.style('pointer-events','auto')
      this.zoomSection.style('pointer-events','auto')
    }

    //Update cluster tag function
    updateClusterTag(cluster,XScale,YScale){
      let position = cluster.lablePosition();
      D3.select('#lablel_' + cluster.name.split(' ').join('_'))
        .remove()
      D3.select('#paperzoom_section')
        .append('text')
        .attr('id','lablel_' + cluster.name.split(' ').join('_'))
        .attr('x',XScale(position[0]))
        .attr('y',YScale(position[1]))
        .style('fill',cluster.color)
        .text (cluster.name)
    }
  
    //Edit Cluster Function
    editCluster(papers_selected,xScale,yScale){
      console.log('test')
      let dialogRef = this.dialog.open(ClusterDialog,{
        width:'250px',
        data:{
          'papers':papers_selected,
          'cluster_array': this.cluster_array,
          'cluster': {
            'name':papers_selected[0].cluster,
            'color':papers_selected[0].color,
          },
          // 'xScale':xScale,
          // 'yScale':yScale
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      let test = this.cluster_array;
      //If cluster is stored Assign to cluster Array
      if (result !== undefined){
        //Create Cluster
        let cluster = new Cluster(result.cluster_name,result.cluster_papers,result.cluster_color)
        //If it exits awe clear the papers and assign again
        let previous_cluster:Cluster = this.cluster_array.filter(this_cluster => this_cluster.name === result.cluster_name)[0]
        if(previous_cluster){
          //Clear previuous clusters in paper
          previous_cluster.papers.forEach(element =>{
            element.cluster = "";
            //Clear color
            D3.select('#id_' + element.key)
              .style('fill',element.default_color)
          })
        }
        //Here its deleted if existed and changed with the new if not only the new is pushed
        this.cluster_array = this.cluster_array.filter(cluster => cluster.name !== result.cluster_name)
        this.cluster_array.push(cluster)
        //Store Cluster in paper
        result.cluster_papers.forEach(element =>{
          element.cluster = cluster.name;
          element.color = cluster.color;
          D3.select('#id_' + element.key)
          .style('fill',cluster.color)
        })
        let position = cluster.lablePosition()
        D3.select('#lablel_' + cluster.name.split(' ').join('_'))
          .remove()
        D3.select('#paperzoom_section')
          .append('text')
          .attr('id','lablel_' + cluster.name.split(' ').join('_'))
          .attr('x',xScale(position[0]))
          .attr('y',yScale(position[1]))
          .style('fill',cluster.color)
          .text (cluster.name)
      }
      //Set the dots without a cluster back to original color
      // D3.select(
    })
  }
}

@Component({
  selector: 'cluster-dialog',
  templateUrl: 'cluster-dialog.html',
})

export class ClusterDialog{

  constructor(
    public dialogRef: MatDialogRef<ClusterDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ClusterDialogData) {}

  onNoClick(): void {
    this.dialogRef.close({'cluster_name':this.data.cluster.name,'cluster_papers':this.data.papers,'cluster_color':this.data.cluster.color});
  }

  changeColor(event){
    this.data.cluster.color = event.color.hex;
    D3.selectAll('.data_selected')
      .style('fill',event.color.hex)
    
    this.data.papers.forEach(element =>{
      element.color = event.color.hex;
    })
  }

  saveCluster(){
    //We send the value back to scatterplot
    this.dialogRef.close({'cluster_name':this.data.cluster.name,'cluster_papers':this.data.papers,'cluster_color':this.data.cluster.color})
  }

}

export interface ClusterDialogData{
  papers: Array<any>;
  cluster_array: Array<Cluster>
  cluster: {name:string,color:string}
  // xScale:any
  // yScale:any
}