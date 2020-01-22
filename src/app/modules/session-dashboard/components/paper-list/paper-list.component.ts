import { Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import {CollectionsService} from '@app/shared/services/collections.service';
import { Paper_Item } from '@app/shared/classes/paper';

import { Word } from '@app/shared/classes/word';
import {ScatterPlotService} from '@app/shared/services/scatterplot.service'

import * as D3 from 'd3';

@Component({
  selector: 'app-paper-list',
  templateUrl: './paper-list.component.html',
  styleUrls: ['./paper-list.component.css']
})
export class PaperListComponent implements OnInit {
  private data: Array<Paper_Item> = []
  private displayedColumns: string[] = ['name', 'date'];
  private dataSource: MatTableDataSource<Paper_Item>;
  private selection: Array<any>;
  // private overlapping = [];
  private words: Array<Word> = []

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private collectionsService:CollectionsService, private scatterPlotService:ScatterPlotService) { }

  ngOnInit() {
    this.selection = [];
    //Fetch data
    this.data = this.collectionsService.getSessionPapers();
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //Subscribe to paper in session service
    this.collectionsService.papers_in_session_updated.subscribe(newData =>{
      this.data = newData;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
    this.collectionsService.words_in_session_updated.subscribe(sessionWords =>{
      this.words = sessionWords;
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  mouseEnter(paper : any){
    if(!paper.isSelected){
      console.log(paper);
      D3.selectAll('.topicCard').style('display','none')
      if(paper.topics.length > 0){
        this.higlightWords(paper, paper.top_words.words, 'individual')
        paper.topics.forEach((paperTopic)=>{
          console.log(paperTopic);
          D3.select('#topicCard-' + paperTopic)
            .style('display','initial')
        })
      }
    }
  }

  higlightWords(this_papers, Allwords, type){
    if (type === 'individual'){
      Allwords.forEach((element,index) => {
        console.log(element);
        D3.select('#id_' + element)
          .attr('r', (d) => 4 * this_papers.top_words.sigma_nor[index])
          .style('fill','#ffc1be')
        let position = this.wordPosition(element);
        if (position !== undefined){
          D3.select('#zoom_section') 
          .append('text')
          .attr('class','word_scatterplot_label')
          .attr('id','text_' + element)
          // .attr('x',this.scatterPlotService.xScale(position[0]))
          // .attr('y',this.scatterPlotService.yScale(position[1]))
          .style('fill','white')
          .style('font-size',0.25 * this_papers.top_words.sigma_nor[index] + 'rem')
          .text(element)
        }
      }); 
    }else{
      Allwords.forEach((element,index) => {
        console.log(element);
        D3.select('#id_' + element)
          .attr('r', (d) => 4)
          .style('fill','#ffc1be')
        let position = this.wordPosition(element);
        if (position !== undefined){
          D3.select('#zoom_section')
          .append('text')
          .attr('class','word_scatterplot_label')
          .attr('id','text_' + element)
          // .attr('x',this.scatterPlotService.xScale(position[0]))
          // .attr('y',this.scatterPlotService.yScale(position[1]))
          .style('fill','white')
          // .style('font-size',0.25 * this_papers.top_words.sigma_nor[index] + 'rem')
          .text(element)
        }
      }); 
    }
  }

  mouseOut(paper : any){
    if(!paper.isSelected){
      D3.selectAll('.topicCard').style('display','initial')
      console.log("mouse out : " + paper);
      if(paper.topics.length > 0){
        paper.top_words.words.forEach(element => {
          console.log(element);
          //bring circle to original size
          D3.select('#id_' + element)
            .attr('r', (d) => 2)
            .style('fill','#43EFC4')
          //Remove text labels for this paper
          D3.select('#text_' + element).remove()
        });
      }
    }
  }

  mouseClick(paper:any){
    if(!paper.isSelected){
      paper.isSelected = true;
      this.selection.push(paper);
      //Calculate pos for paper
      let position:Array<number> = this.averageXY(paper.top_words);
      //Position Paper
      D3.select('#zoom_section')
          .append('text')
          .style('fill','white')
          .attr('class','scatterPlot_labels')
          .attr('id','paper_label'+ paper['key'])
          // .attr('x',this.scatterPlotService.xScale(position[0]))
          // .attr('y',this.scatterPlotService.yScale(position[1]))
          .style('fill','white')
          .text (paper['name'])
      }else{
        paper.isSelected = false;
        this.selection = this.selection.filter(papers => papers.name !== paper.name)
        D3.select('#' + 'paper_label' + paper['key']).remove()
      }
      let overlappingW = this.overlappingWords()
      D3.selectAll('.word_scatterplot_label').remove()
      this.higlightWords(this.selection,overlappingW,'multiple')
  }

  //Get Overlaping Words
  overlappingWords(){
    let overlapping = [];
    for(let i= 0;i<this.selection.length;i++){
      if (i ===0) overlapping = this.selection[0].top_words.words;
      else overlapping = this.selection[i].top_words.words.filter(e => overlapping.includes(e))
    }
    console.log('Overlapping Words: ' + overlapping);
    return overlapping;
  }
  //Gets a word Position
  wordPosition(wordValue:any){
    let word = this.words.filter(words => words.word === wordValue)[0]
    if (word){
      let x = word.x
      let y = word.y
      return [x,y];
    }else{
      console.log(wordValue + " : is not a session word")
    }
  }

  // let x = x.push(word.x * wordsObject.sigma_nor[index])

  //average X, Y for positioning topic Text in Scatterplot  
  averageXY(wordsObject:any){
    let x_array = [];
    let y_array = [];
    let avg_x = 0
    let avg_y = 0
    wordsObject.words.forEach((element,index) => {
      let this_word_position = this.wordPosition(element)
      if (this_word_position!==undefined){
        x_array.push(this.wordPosition(element)[0])
        y_array.push(this.wordPosition(element)[0]);
      }
    })
    for(let i=0;i<x_array.length;i++){
      avg_x = avg_x + x_array[i];
      avg_y = avg_y + y_array[i];
    } 
    avg_x = avg_x/x_array.length;
    avg_y = avg_y/y_array.length;
    console.log(avg_x)
    console.log(avg_y)
    return [avg_x,avg_y]
  }

  // /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {
  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }

}
