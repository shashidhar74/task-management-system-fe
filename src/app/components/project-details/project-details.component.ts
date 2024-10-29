import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { TaskDetails } from '../../models/tasks';
import { ServicesService } from '../../services/services.service';
import { DatePipe } from '@angular/common';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule,MatSelectModule,MatProgressSpinnerModule,AgGridModule,MatDatepickerModule,MatNativeDateModule,MatIconModule,MatExpansionModule,MatButtonModule,MatInputModule,ReactiveFormsModule],
  templateUrl: './project-details.component.html',
  styleUrl: './project-details.component.css'
})
export class ProjectDetailsComponent implements OnInit {
  projectName: string='';
  gridApi: any;
  gridColumnApi: any;
  loadSpinner:boolean=false;
  rowData:Array<TaskDetails>=[];
  public columnDefs: any[] = [];
  public taskForm: UntypedFormGroup | any;
  currentUser='';
  searchTerm: string = '';
  statusList =['Open', 'Closed', 'In Progress', 'Hold', 'Completed'];
  constructor(private route: ActivatedRoute,private service :ServicesService) {
    this.taskForm = new UntypedFormGroup({
      projectName: new UntypedFormControl(''),
      taskName: new UntypedFormControl('', Validators.required),
      owner: new UntypedFormControl('', Validators.required),
      status: new UntypedFormControl('', Validators.required),
      priority: new UntypedFormControl('', Validators.required),
      startDate: new UntypedFormControl('', Validators.required),
      dueDate: new UntypedFormControl('', Validators.required),
      createdOn: new UntypedFormControl(''),
      createdBy: new UntypedFormControl({ value: this.currentUser }),
      modifiedOn: new UntypedFormControl(''),
      modifiedBy: new UntypedFormControl({ value: this.currentUser })
    });
  }

  ngOnInit() {
    this.columnDefs = this.createColumnDefs();
    this.getProjectsData();
    this.route.params.subscribe(params => {
      this.projectName = params['project_name'];
      this.taskForm.get('projectName').setValue(this.projectName);
    });
    this.service.username$.subscribe(username => {
      this.currentUser = username;
      this.taskForm.get('createdBy').setValue(this.currentUser);
      this.taskForm.get('modifiedBy').setValue(this.currentUser);
      this.taskForm.get('modifiedOn').setValue(new Date());
      this.taskForm.get('createdOn').setValue(new Date());
    });
  }
  public defaultColDef: ColDef = {
    flex: 1,
    cellDataType: false,
  };
  
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  private createColumnDefs() {
    return [
      { headerName: 'Task ID', field: 'taskId' },
      { headerName: 'Project Name', field: 'projectName' },
      { headerName: 'Task Name', field: 'taskName' },
      { headerName: 'Owner', field: 'owner' },
      { headerName: 'Status', field: 'status' },
      { headerName: 'Priority', field: 'priority' },
      { headerName: 'Due Date', field: 'dueDate', valueFormatter: this.dateFormatter },
      { headerName: 'Start Date', field: 'startDate', valueFormatter: this.dateFormatter },
      { headerName: 'Created On', field: 'createdOn', valueFormatter: this.dateFormatter },
      { headerName: 'Created By', field: 'createdBy' },
      { headerName: 'Modified On', field: 'modifiedOn', valueFormatter: this.dateFormatter },
      { headerName: 'Modified By', field: 'modifiedBy' }
    ];
  }

  onSearchChange() {
    // Implement ag-Grid API call to filter data based on searchTerm
    // Assuming you have a grid API reference:
    if (this.gridApi) {
      this.gridApi.setQuickFilter(this.searchTerm); // Use ag-Grid's quick filter
    }
  }

  private dateFormatter(params: any) {
    return new Date(params.value).toLocaleDateString();
  }

  getProjectsData(){
    this.loadSpinner=true;
    this.service.getAllTaks().subscribe({
      next : (response)=>{
        this.loadSpinner=false;
     this.rowData=response;
      }
    })
    }

    onSave() {
      if (this.taskForm.valid) { 
        this.loadSpinner=true;
        const taskDetails: TaskDetails = this.taskForm.value; // Get the form values
        this.service.addNewTask([taskDetails]).subscribe({
          next: (response) => {
            this.loadSpinner=false;
            this.getProjectsData();
            this.taskForm.reset();
          },
          error: (error) => {
            this.loadSpinner=false;
            console.error('Error saving task:', error);
          }
        });
      } else {
        this.loadSpinner=false;
        console.error('Form is invalid');
      }
    }
    
}
