import { Component, ElementRef, OnInit, AfterViewInit, HostListener } from '@angular/core';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material';

import { Topic } from '@app/shared/classes/topic';
import { CollectionsService } from '@app/shared/services/collections.service';
import { Word } from '@app/shared/classes/word';
import {ScatterPlotService} from '@app/shared/services/scatterplot.service'

import * as D3 from 'd3';

export interface Labels {
  name: string;
}

@Component({
  selector: 'app-topic-viewer',
  templateUrl: './topic-viewer.component.html',
  styleUrls: ['./topic-viewer.component.css']
})
export class TopicViewerComponent implements OnInit, AfterViewInit {
  @HostListener('window:resize') onResize(){
    //Listener for the window size to set the height of the topic list
    D3.select('#container')
      .style('height', (window.innerHeight - 107) + 'px')
  }
  private topic_list: Array<Topic> = [];
  private selected: Array<number> = [];
  private words: Array<Word> = []
  private colors: Array<String> = ['#FF66CC','blue','yellow']
  private color_index: number = 0;
  private divHeight:number;

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor(private collectionsService:CollectionsService, private scatterPlotService:ScatterPlotService) { }

  ngOnInit() {
    //Fetch data
    this.topic_list = this.collectionsService.getSessionTopics();

    //Subscriptions
    this.collectionsService.topics_in_session_updated.subscribe(newData =>{
       this.topic_list = newData;
     })

    this.collectionsService.words_in_session_updated.subscribe(sessionWords =>{
      this.words = sessionWords;
    })

  }

  //For dynamic Height
  ngAfterViewInit(){
    D3.select('#container')
      .style('height', (window.innerHeight - 107) + 'px')
    
  }

  isTopicSelected(topicID){
    let result = this.selected.filter(topic => topic === topicID)
    let topicIsSelected = false
    if (result.length > 0){
      topicIsSelected = true
    }
    return topicIsSelected 
  }

  editLabel(topic,event){
    if (topic.isLabelBeingEdited){
      topic.isLabelBeingEdited = false;
    } 
    else{
      topic.isLabelBeingEdited = true;
    }
  }

  deleteWord(word,event){
    console.log('delete this word: ' + word.word)
  }

  toogleExemplar(word){
    if (word.exemplar){
      word.exemplar = false;
    } 
    else{
      word.exemplar = true;
    }
  }

//   mouseClick(topic : any,event){
//     // console.log("mouse click : " + topic);
//     if(this.isTopicSelected(topic.id)){ //Unselect
//       // this.selected = false;
//       D3.select('#topicCard-'+topic.id)
//         .style("border","2px solid #43EFC4")
//         .style("background-color","transparent")
//       this.selected.splice(this.selected.indexOf(topic.id),1)
//       topic.words.forEach(element => {
//         //unselect word tag
//         let a = this.words.filter(words => words.word === element.word)[0].isSelected = false;
//         // console.log(a);
//         D3.select('#id_' + element.word)
//           .attr('r', (d) => 2)
//           .style('fill','#43EFC4')
//           .style('opacity',0.3)
//           .style('stroke',"#43EFC4")
//       });
//       D3.selectAll('.topic_label_'+topic.labels[0].name).remove()
//     }else{ //Select
//       D3.select('#topicCard-'+ topic.id)
//         .style("border","4px solid #43EFC4")
//         .style("background-color","#004966")
//       this.selected.push(topic.id);
//       //Calculate pos for text
//       let position:Array<number> = this.averageXY(topic.words);
//       //position text
//       topic.labels.position = position; //I think I can delete this line
//       D3.select('#zoom_section')
//         .append('text')
//         .style('fill','white')
//         // .attr('class','scatterPlot_topic_labels')
//         .attr('class','topic_label_'+topic.labels[0].name)
//         // .attr('x',this.scatterPlotService.xScale(position[0]))
//         // .attr('y',this.scatterPlotService.yScale(position[1]))
//         .style('fill','white')
//         .text (topic.labels[0].name)
//       //Highlight words
//       topic.words.forEach(element => {
//         let a = this.words.filter(words => words.word === element.word)[0].isSelected = true;
//         // console.log(a);
//         D3.select('#id_' + element.word)
//           .attr('r', (d) => 6)
//           .style('opacity',0.6)
//           .style('fill','#f5d6d4')
//           .style('stroke',"#f5d6d4")
//       });
//     }   
//  }

//  //average X, Y for positioning topic Text in Scatterplot  
//   averageXY(wordsArray:Array<Word>){
//     let x = [];
//     let y = [];
//     let avg_x = 0
//     let avg_y = 0
//     wordsArray.forEach(element => {
//       let word = this.words.filter(words => words.word === element.word)[0]
//       x.push(word.x)
//       y.push(word.y)
//     })
//     for(let i=0;i<x.length;i++){
//       avg_x = avg_x + x[i];
//       avg_y = avg_y + y[i];
//     } 
//     avg_x = avg_x/x.length;
//     avg_y = avg_y/y.length;
//     // console.log(avg_x)
//     // console.log(avg_y)
//     return [avg_x,avg_y]
//   }

  // mouseEnter(topic : any){
  //   if(!this.isTopicSelected(topic.id)){
  //     // console.log("mouse enter : " + topic);
  //     //Highlight words
  //     topic.words.forEach(element => {
  //       // if (element[element.length-1]==='*'){
  //       //   element = element.substring(0, element.length-1)
  //       // }
  //       D3.select('#id_' + element.word)
  //         .attr('r', (d) => d['sigma_nor'] * 2)
  //         .style('fill','#ffc1be')
  //     });
  //     //Show papers with this topic and hide the rest
  //     D3.selectAll('.paper_row').style('display','none')
  //     topic.papers.forEach((paperID)=>{
  //       // console.log(paperID);
  //       D3.select('#paper_id' + paperID)
  //         .style('display','table-row')
  //     })
  //   }else{
  //     topic.words.forEach(element => {
  //       // if (element[element.length-1]==='*'){
  //       //   element = element.substring(0, element.length-1)
  //       // }
  //       D3.select('#id_' + element.word)
  //           .style('opacity',0.6)
  //           .style('stroke',"white")
  //     })
  //   }
  // }

  mouseClick(topic : any){
    if(this.isTopicSelected(topic.id)){
      //Unselect topic
      this.selected.splice(this.selected.indexOf(topic.id),1);
      //Unstyle Div
      D3.select('#topicCard-'+topic.id)
        .style("border","2px solid #43EFC4")
        .style("background-color","transparent")
      topic.papers.forEach( element => {
        //UnSelect Paper
        D3.selectAll('.dot')
            .style('visibility','initial')
            //Apply Opacity
            .style('opacity', (d) => this.scatterPlotService.circle_opacity)
            .attr('fill',(d) => '#43EFC4')
          })
      //Decrease color index
      this.color_index = this.color_index - 1;
    }else{
      //Select Topic
      this.selected.push(topic.id);
      //Style
      D3.select('#topicCard-'+ topic.id)
        .style("border","4px solid" + this.colors[this.color_index])
        .style("background-color","#004966")
      //Create scale for opacities
      let weights = topic.papers.map(x => x.weight);
      let max_weight = parseFloat(D3.max(weights))
      let min_weight = parseFloat(D3.min(weights))
      let opacity_scale = D3.scaleLinear();
      opacity_scale.range([0,1])
      opacity_scale.domain([min_weight,max_weight])
      topic.papers.forEach( element => {
        //Select Paper
        D3.selectAll('.class_' + element.id)
            //Apply Opacity
            .style('fill', (d) => {
              if (element.weight!==0) return ''+this.colors[this.color_index]
              // else{
              //   D3.select('.class_' + element.id).style('visibility','hidden')
              // }
            })
            // .style('opacity', (d) => {
            //   if (element.weight!==0) return opacity_scale(element.weight)
            //   else{
            //     D3.select('.' + element.id).style('visibility','hidden')
            //   }
            // })
            // .style('fill',''+this.colors[this.color_index])
      })
      //Decrease color index
      this.color_index = this.color_index + 1;
    }
  }

  mouseEnter(topic:any){
    if(!this.isTopicSelected(topic.id)){
      //Create scale for opacities
      let weights = topic.papers.map(x => x.weight);
      let max_weight = parseFloat(D3.max(weights))
      let min_weight = parseFloat(D3.min(weights))
      let opacity_scale = D3.scaleLinear();
      opacity_scale.range([0,0.7])
      opacity_scale.domain([min_weight,max_weight])
      topic.papers.forEach( element => {
        //Select Paper
        D3.selectAll('.class_' + element.id)
            //Apply Opacity
            .style('opacity', (d) => {
              let opac;
              if (element.weight!==0) opac = opacity_scale(element.weight)
              else opac = 0.1
              return opac
            })
            .style('fill', (d) => {
              let color;
              if (element.weight!==0) color =  ''+this.colors[this.color_index]
              else color = '#43EFC4'
              return color
            })
      })
    }
  }

  mouseOut(topic:any){
    if(!this.isTopicSelected(topic.id)){
      topic.papers.forEach( element => {
        //Select Paper
        D3.selectAll('.class_' + element.id)
            //Apply Opacity
            .style('opacity', (d) => this.scatterPlotService.circle_opacity)
            .style('fill',(d) => {
              let color;
              if (d['new']) color = '#FD5F00';
              else color = '#43EFC4';
              return color
              })
      })
    }
  }

//  mouseOut(topic : any){
//   if(!this.isTopicSelected(topic.id)){
//     // console.log("mouse out : " + topic);
//     topic.words.forEach(element => {
//       // if (element[element.length-1]==='*'){
//       //   element = element.substring(0, element.length-1)
//       // }
//       // console.log(element.word);
//       D3.select('#id_' + element.word)
//         .attr('r', (d) => d['sigma_nor']/2)
//         .style('fill','#43EFC4')
//     });
//     //Show all topics again
//     D3.selectAll('.paper_row').style('display','table-row')
//   }else{
//     topic.words.forEach(element => {
//       // if (element[element.length-1]==='*'){
//       //   element = element.substring(0, element.length-1)
//       // }
//       D3.select('#id_' + element.word)
//           .style('opacity',0.3)
//           .style('stroke',"#ffc1be")
//     })
//   }
//  }

 drop(event: CdkDragDrop<string[]>) {
  // moveItemInArray(this.topic_list, event.previousIndex, event.currentIndex);
  let topic = this.topic_list[event.previousIndex];
  //Change color for knowing whats changing
  topic.words.forEach(element => {
    D3.select('#id_' + element.word)
    .attr('stroke','white')
    .attr('stroke-width','1')
    .style('fill','f9ddda')
  });
  this.collectionsService.changeImportance(topic,'drop',event.currentIndex);
}

deleteTopic(topic:any, event:Event){
  // this.topic_list = this.topic_list.filter(topics => topics.id!=topic.id)
  this.collectionsService.changeImportance(topic,'cross',this.topic_list.length-1);
  // for(let i =0; i<=topic.words.length;i++){
  //   //I should delete from the service but is not populating upwards im hidding for now the nodes in scatterplot
  //   //Then I should change a parameter that says that word is not liked.
  //   // this.words = this.words.filter(words => words.word !== topic.words[i].word)

  //   // D3.select('#id_' + topic.words[i].word).style("visibility", "hidden")
  // }
}

add(event: MatChipInputEvent,topic:any): void {
  const input = event.input;
  const value = event.value;

  // Add our fruit
  if ((value || '').trim()) {
    let this_topic = this.topic_list.filter(topics => topics.id === topic.id)
    this_topic[0].labels.push({name: value.trim()})
  }

  // Reset the input value
  if (input) {
    input.value = '';
  }
}

remove(label: any,topic:any): void {
  let this_topic = this.topic_list.filter(topics => topics.id === topic.id)
  const index = this_topic[0].labels.indexOf(label);

  if (index >= 0) {
    this_topic[0].labels.splice(index, 1);
  }
}

increaseWeight(topic:any, event:Event){
  this.collectionsService.changeImportance(topic,'increase',this.topic_list.length-1);
}

decreaseWeight(topic:any, event:Event){
  this.collectionsService.changeImportance(topic,'decrease',this.topic_list.length-1);
}


}
