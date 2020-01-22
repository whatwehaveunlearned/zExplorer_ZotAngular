import { Component, OnInit, AfterViewInit, HostListener } from '@angular/core';
import * as D3 from 'd3';

@Component({
  selector: 'app-session-dashboard-page',
  templateUrl: './session-dashboard-page.component.html',
  styleUrls: ['./session-dashboard-page.component.css']
})
export class SessionDashboardPageComponent implements AfterViewInit {

  private isVisible: boolean = true;
  private activeTab:string = 'papers'
  constructor() { }

  hideColumn(){
    this.isVisible = !this.isVisible; 
  }

  //For dynamic Height
  ngAfterViewInit(){
    D3.select('.container')
      .style('height', (window.innerHeight - 107) + 'px')
  }

  @HostListener('window:resize') onResize(){
    //Listener for the window size to set the height of the topic list
    D3.select('#container')
      .style('height', (window.innerHeight - 107) + 'px')
  }

}
