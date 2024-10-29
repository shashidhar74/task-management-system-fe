import { Component } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, GridReadyEvent, RowSelectionOptions, RowValueChangedEvent } from 'ag-grid-community';
import { ServicesService } from '../../services/services.service';
import { Employee } from '../../models/employee';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AgGridModule,MatIconModule,MatProgressSpinnerModule],
  providers: [DatePipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
constructor(private service :ServicesService,private datePipe: DatePipe){}
rowData:Array<Employee>=[];
private gridApi: any;
loadSpinner:boolean=false;
username: any;
  columnDefs: ColDef[] = [
    { headerName: 'Employee ID', field: 'id', sortable: true, filter: true, editable: false },
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Designation', field: 'designation', sortable: true, filter: true },
    { headerName: 'Department', field: 'department', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Created On', field: 'createdOn', sortable: true, filter: 'agDateTimeColumnFilter', valueFormatter: this.dateTimeFormatter },
    { headerName: 'Created By', field: 'created_by', sortable: true, filter: true },
    { headerName: 'Modified On', field: 'modified_on', sortable: true, filter: 'agDateTimeColumnFilter', valueFormatter: this.dateTimeFormatter },
    { headerName: 'Modified By', field: 'modified_by', sortable: true, filter: true }
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    editable: true,
    cellDataType: false,
  };
  public editType: "fullRow" = "fullRow";
  public rowSelection: RowSelectionOptions | "single" | "multiple" = {
    mode: "multiRow",
  };

  dateFormatter(params: { value: string | number | Date; }) {
    return new Date(params.value).toLocaleDateString();
  }

  dateTimeFormatter(params: { value: string | number | Date; }) {
    const date = new Date(params.value);
    return isNaN(date.getTime()) ? '' : date.toLocaleString();
  }

  ngOnInit(){
    this.service.username$.subscribe(username => {
      this.username = username;
    });
    this.getEmployeeData()
  }

getEmployeeData(){
this.loadSpinner=true;
this.service.getAllEmployeeData().subscribe({
  next: (response) => {
    setTimeout(() => {
      this.rowData = response;
      this.loadSpinner = false;
    }, 1000);
  },
  error: (err) => {
    this.loadSpinner = false;
    console.error(err);
  }
});
}

onGridReady(params: GridReadyEvent) {
  this.gridApi = params.api;
}

onCellValueChanged(event: CellValueChangedEvent) {
  console.log(
    "onCellValueChanged: " + event.colDef.field + " = " + event.newValue,
  );
}
onRowValueChanged(event: RowValueChangedEvent) {
  const data = event.data;
}

onBtStartEditing(rowIndex: number) {  
  this.gridApi
 if (rowIndex === 0) {
  const newRowData: { [key: string]: any } = {};
  this.columnDefs.forEach(colDef => {
    if (colDef.field) { 
      newRowData[colDef.field] = ''; 
    }
  });
  const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
  newRowData['created_on'] =formattedDate;
  newRowData['created_by'] = this.username;
  this.gridApi.applyTransaction({ add: [newRowData], addIndex: 0 });
  const renderedNodes = this.gridApi.getRenderedNodes();
  const newRowNode = renderedNodes[0];
    if (newRowNode) {
      newRowNode.setSelected(true);
    }
    rowIndex = 0; 
    this.gridApi.setFocusedCell(rowIndex, 'name');
    for (let colIndex = 0; colIndex < this.columnDefs.length; colIndex++) {
      const colKey = this.columnDefs[colIndex].field;
      if (colKey) {
        this.gridApi.startEditingCell({ rowIndex, colKey });
      }
    }
  }
}
onSave(){
  this.loadSpinner=true;
  this.gridApi.stopEditing();
  const rowNodes = this.gridApi.getRenderedNodes();
  const selected =this.gridApi.getSelectedRows();
  selected[0].created_on = new Date(selected[0].created_on).toISOString();
  this.service.addEmployees(selected).subscribe({
    next : (response)=>{
      this.loadSpinner=false;
     this.getEmployeeData();
    },error: (err) => {
      this.loadSpinner = false;
      console.error(err);
    }
  });
  }

refreshTable(){
  this.getEmployeeData();
} 
}
