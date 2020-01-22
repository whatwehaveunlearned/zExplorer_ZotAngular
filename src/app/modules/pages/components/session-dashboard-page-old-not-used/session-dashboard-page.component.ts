import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-dashboard-page',
  templateUrl: './session-dashboard-page.component.html',
  styleUrls: ['./session-dashboard-page.component.css']
})
export class SessionDashboardPageComponent implements OnInit {

  private isVisible: boolean = true;
  private activeTab:string = 'papers'
  constructor() { }

  ngOnInit() {
  }

  hideColumn(){
    this.isVisible = !this.isVisible; 
  }

}
