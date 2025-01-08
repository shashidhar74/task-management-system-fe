import { Component, ElementRef, NgModule, viewChild, ViewChild } from '@angular/core';
import { AgGridModule } from 'ag-grid-angular';
import { CellValueChangedEvent, ColDef, GridReadyEvent, RowSelectionOptions, RowValueChangedEvent } from 'ag-grid-community';
import { ServicesService } from '../../services/services.service';
import { Employee } from '../../models/employee';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { error } from 'node:console';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AgGridModule,NgbModalModule,MatIconModule,FormsModule,MatProgressSpinnerModule,ReactiveFormsModule,MatInputModule,MatButtonModule],
  providers: [DatePipe],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {

constructor(private service :ServicesService,private datePipe: DatePipe){}
@ViewChild('exampleModal') exampleModal:ElementRef | undefined;
rowData:Array<Employee>=[];
private gridApi: any;
loadSpinner:boolean=false;
searchQuery: string = '';
username: any;
todaysDateTime:any;
employeeForm!: FormGroup;
alertMessage:String='';
imageError: string | null = null; 
imageFileName: string | null = null;  // Variable to store the image file name
  imagePreview: string | null = null; 
departments: string[] = ['Engineering', 'MBA', 'MCA', 'BSc', 'MTech'];
designations: string[] = [
  'Software Developer', 
  'Project Manager', 
  'HR Specialist', 
  'Business Analyst', 
  'Data Scientist',
  'Marketing Manager', 
  'Sales Executive', 
  'Product Manager', 
  'System Architect', 
  'UX/UI Designer'
];
  columnDefs: ColDef[] = [
    {
      headerName: 'Actions',
      field: 'actions',
      sortable: false,
      filter: false,
      cellRenderer: (params: any) => {
        return `
          <button title="Edit" (click)="onEditClick(${params.data.id})">
            <span class="material-icons">edit</span>
          </button>
          <button title="Delete" (click)="onDeleteClick(${params.data.id})">
            <span class="material-icons">delete</span>
          </button>
        `;
      },
      width: 120
    },
    { headerName: 'Employee ID', field: 'id', sortable: true, filter: true, editable: false },
    {
      headerName: 'Image', 
      field: 'image', 
      sortable: true, 
      filter: true,
      cellRenderer: (params:any) => {
        const imageUrl = params.value ? params.value : 'path_to_default_image.jpg'; 
        return `<img src="http://localhost:9001${params.value}" style="width: 38px; height: 40px; object-fit: cover;" />`;
      }
    },
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
    editable: false,
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
    this.todaysDateTime=this.service.getCurrentDateTime();
    this.getEmployeeData();
    this.employeeForm = new FormGroup({
      id: new FormControl(''),
      name: new FormControl('',[Validators.required, Validators.minLength(3)]),
      designation: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      email: new FormControl('',[Validators.required, Validators.email] ),
      phoneNumber:new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      createdOn: new FormControl(this.todaysDateTime),
      created_by: new FormControl(this.username),
      modified_on: new FormControl(''),
      modified_by: new FormControl(''),
      image: new FormControl(null, [Validators.required])
    });
  }
  onCellClicked(event: any) {
    if (event.colDef.headerName === 'Actions') {
      if(event.event.target.innerHTML === 'edit'){
        let data =event.node.data;
        this.employeeForm.patchValue({
          name: data.name,
          designation: data.designation,
          department: data.department,
          email: data.email,
          phoneNumber: data.phoneNumber,
          createdOn: data.createdOn, // Ensure that your data contains the correct format
          created_by: data.created_by,
          modified_on: this.todaysDateTime,
          modified_by: this.username,
          image:data.image
        });
        this.imagePreview = data.image ? "http://localhost:9001"+data.image : null; 
        this.openModel();
      }else if(event.event.target.innerHTML === 'delete'){
        let data =event.node.data;
        this.onDeleteEmployee(data.id)
      }
    }    
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
  
      // Check file size and type
      if (file.size > 5 * 1024 * 1024) {
        this.imageError = 'File size should not exceed 5MB';
        input.value = '';  // Reset the input
        this.employeeForm.patchValue({ image: null }); // Set form control to null
        return;
      }
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        this.imageError = 'Only image files (JPEG, PNG, GIF) are allowed';
        input.value = ''; // Reset the input
        this.employeeForm.patchValue({ image: null }); // Set form control to null
        return;
      }
  
      this.imageError = null;
  
      // Patch the form control with the selected file (without trying to set the input value)
      this.employeeForm.patchValue({
        image: file
      });
    }
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
  if(this.employeeForm.valid){
    this.loadSpinner=true;
    const selected =this.employeeForm.value;
    const formData = new FormData();
    formData.append('employee', JSON.stringify({
      name: selected.name,
      designation: selected.designation,
      department: selected.department,
      email: selected.email,
      created_by: selected.created_by,
      created_on: selected.createdOn,
      updatedOn: selected.updatedOn,
      modified_by:selected.modified_by
    }));
    if (selected.image && selected.image instanceof File) {
      formData.append('image', selected.image, selected.image.name);
    }
    this.service.addEmployees(formData).subscribe({
      next : (response)=>{
        this.loadSpinner=false;
        this.closeModel();
       this.refreshTable();
      },error: (err) => {
        this.loadSpinner = false;
        console.error(err);
      }
    });
  }else{
  this.alertMessage='In valid Data!!.Please enter correct details.'
  }
 
  }

  onDeleteEmployee(id: number): void {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.loadSpinner=true;
      this.service.deleteEmployee(id).subscribe({
       next:(response:any)=>{
        this.loadSpinner=false;
        console.log('Response from delete:', response);
        this.refreshTable();
       },error:(error)=>{
        this.loadSpinner=false;
       }
      })
    }
  }


  onEditClick(id: number) {
    console.log('Edit action triggered for employee with id:', id);
    // Implement your edit logic here
  }

  // Delete button click handler
  onDeleteClick(id: number) {
    console.log('Delete action triggered for employee with id:', id);
    // Implement your delete logic here
  }

refreshTable(){
  this.getEmployeeData();
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
