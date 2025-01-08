import { Component, ElementRef, ViewChild } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, GridOptions, GridReadyEvent, RowSelectionOptions, RowValueChangedEvent } from 'ag-grid-community';
import { ServicesService } from '../../services/services.service';
import { Project } from '../../models/projectdetails';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { UntypedFormGroup, UntypedFormControl, Validators, FormsModule, FormGroup, FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatNativeDateModule } from '@angular/material/core'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectListDialogComponent } from './project-list-dialog/project-list-dialog.component';
ProjectListDialogComponent
@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [AgGridModule,MatIconModule,MatDialogModule,FormsModule,MatCardModule,MatExpansionModule,ReactiveFormsModule,MatDatepickerModule,MatInputModule,MatNativeDateModule],
  providers: [DatePipe],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.css'
})
export class ProjectListComponent {

  

constructor(private service :ServicesService,private datePipe: DatePipe,  private dialog: MatDialog,){}
@ViewChild('exampleModal') exampleModal:ElementRef | undefined;
rowData:Array<Project>=[];
gridOptions: GridOptions = {};
private gridApi: any;
username: any;
todaysDateTime:any;
searchQuery: string = '';
projectForm!: FormGroup;
managers:any=[];
  columnDefs: ColDef[] = [
    { headerName: 'Project ID', field: 'project_id', sortable: true, filter: true,editable: false  },
    { headerName: 'Project Name', field: 'project_name', sortable: true, filter: true},
    { headerName: 'Project Head', field: 'project_head', sortable: true, filter: true},
    { headerName: 'Start Date', field: 'start_date', sortable: true, filter: 'agDateColumnFilter', valueFormatter: this.dateFormatter},
    { headerName: 'End Date', field: 'end_date', sortable: true, filter: 'agDateColumnFilter', valueFormatter: this.dateFormatter},
    { headerName: 'Created On', field: 'created_on', sortable: true, filter: 'agDateTimeColumnFilter', valueFormatter: this.dateTimeFormatter},
    { headerName: 'Created By', field: 'created_by', sortable: true, filter: true},
    { headerName: 'Modified On', field: 'modified_on', sortable: true, filter: 'agDateTimeColumnFilter', valueFormatter: this.dateTimeFormatter},
    { headerName: 'Modified By', field: 'modified_by', sortable: true, filter: true}
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

  // Formatter for date-time columns
  dateTimeFormatter(params: { value: string | number | Date; }) {
    return new Date(params.value).toLocaleString();
  }

  ngOnInit(){
    this.service.username$.subscribe(username => {
      this.username = username;
    });
    this.todaysDateTime=this.service.getCurrentDateTime();
    this.projectForm = new FormGroup({
      project_id: new FormControl('', Validators.required),
      project_name: new FormControl('', Validators.required),
      project_head: new FormControl('', Validators.required),
      start_date: new FormControl('', Validators.required),
      end_date: new FormControl('', Validators.required),
      created_on: new FormControl(this.todaysDateTime),
      created_by: new FormControl(this.username),
      modified_on: new FormControl('', Validators.required),
      modified_by: new FormControl('', Validators.required)
    });
    this.getEmplyeeBydesignation();
    this.getProjectsData();
  }

getProjectsData(){
this.service.getAllProjectsData().subscribe({
  next : (response)=>{
 this.rowData=response;
  }
})
}

getEmplyeeBydesignation(){
  this.managers = [];
  this.service.getEmployeesByDesignation().subscribe({
    next:(res)=>{
      this.managers = res.map(employee => employee.name);
      console.log(this.managers);
      
    }
  })
  console.log(this.managers);
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
    this.gridApi.setFocusedCell(rowIndex, 'project_name');
    for (let colIndex = 0; colIndex < this.columnDefs.length; colIndex++) {
      const colKey = this.columnDefs[colIndex].field;
      if (colKey) {
        this.gridApi.startEditingCell({ rowIndex, colKey });
      }
    }
  }
}
onSave(){
  // this.gridApi.stopEditing();
  // const rowNodes = this.gridApi.getRenderedNodes(); // Get all rendered row nodes
  // const updatedData = rowNodes.map((node:any) => node.data); // Map to get the row data
  // const selected =this.gridApi.getSelectedRows();
  // const projectObject = selected[0];
  // projectObject.created_on = new Date(projectObject.created_on).toISOString();
  let projectDta=this.projectForm.value;
  this.service.addNewProject(projectDta).subscribe({
    next : (response)=>{
   console.log(response)
    }
  })
  
}

refreshTable(){
  this.getProjectsData();
} 

onAddRow(): void {
  const dialogRef = this.dialog.open(ProjectListDialogComponent, {
    width: '90%',
    height: '30%', 
    maxWidth:'90%',
  })
  dialogRef.afterClosed().subscribe(isDataSaved => {
    if(isDataSaved){
      //const formattedDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
      isDataSaved.created_on = new Date();
      isDataSaved.created_by= this.username;
      this.service.addNewProject(isDataSaved).subscribe({
        next : (response)=>{
       console.log(response);
        }
      })
    }
  })
}

openModel(){
  if(this.exampleModal){
    this.exampleModal.nativeElement.classList.add('show');
    this.exampleModal.nativeElement.style.display ="block"
  }
}

closeModel() {
  if (this.exampleModal) {
    this.exampleModal.nativeElement.classList.remove('show');
    this.exampleModal.nativeElement.style.display = 'none';
  }
}
}
