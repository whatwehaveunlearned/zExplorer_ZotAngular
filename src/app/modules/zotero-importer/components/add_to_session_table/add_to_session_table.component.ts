import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

import {CollectionsService} from '@app/shared/services/collections.service';
import { Paper_Item } from '@app/shared/classes/paper';

@Component({
  selector: 'app-add-to-session-table',
  templateUrl: './add_to_session_table.component.html',
  styleUrls: ['./add_to_session_table.component.css']
})
export class AddToSessionTableComponent implements OnInit {
  private data: Array<Paper_Item> = []
  private displayedColumns: string[] = ['select','key','title', 'date', 'author1','author2','author3'];
  private dataSource: MatTableDataSource<Paper_Item>;
  private selection: SelectionModel<Paper_Item>;
  public selected_collections: Array<Paper_Item>


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private collectionsService:CollectionsService) { }

  ngOnInit() {
    const initialSelection = []
    const allowMultiSelect = true;
    this.selection = new SelectionModel<Paper_Item>(allowMultiSelect,initialSelection);
    //Fetch data
    this.data = this.collectionsService.getPapersToAddToSession();
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    //Subscribe to paper service
    this.collectionsService.papers_to_add_to_session_updated.subscribe(newData =>{
      this.data = newData;
      this.dataSource = new MatTableDataSource(this.data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  //Open Papers in that Collection
  onClick(){
    console.log(this.selected_collections);
    this.collectionsService.addPapersToAddToSession(this.selection.selected)
  }
}