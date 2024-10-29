import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProjectListComponent } from '../project-list.component';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input'; 
import { MatDatepickerModule } from '@angular/material/datepicker'; 
import { MatButtonModule } from '@angular/material/button';
import { ServicesService } from '../../../services/services.service';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-project-list-dialog',
  standalone: true,
  imports: [CommonModule,MatDialogModule,MatSelectModule,MatDatepickerModule,MatButtonModule,ReactiveFormsModule,MatInputModule,MatIconModule,FlexLayoutModule,MatTooltipModule,MatFormFieldModule],
  templateUrl: './project-list-dialog.component.html',
  styleUrl: './project-list-dialog.component.css'
})
export class ProjectListDialogComponent {
  managers:any=[];
  projectDetailsInputForm = new UntypedFormGroup({
    project_name: new UntypedFormControl('', Validators.required),
    project_head: new UntypedFormControl('', Validators.required),
    start_date: new UntypedFormControl('', Validators.required),
    end_date: new UntypedFormControl('', Validators.required),
    created_on:new UntypedFormControl(),
    created_by:new UntypedFormControl()
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ProjectListComponent>,
    private dialog: MatDialog,
    private service :ServicesService
    
  ) {
    // this.rowAdd = data.rowValue;
    // this.previousValue = data.previousData;
    // this.isEditData = data.editData;
    // this.selectedDetails = data.paymentMethodTypeDataList;
  }
  ngOnInit(){
    this.getEmplyeeBydesignation();
  }



  onClose() {
    this.dialogRef.close();
  }
  onSave(){
    if (this.projectDetailsInputForm.valid) {
      const projectDetails = this.projectDetailsInputForm.value;
      this.dialogRef.close(projectDetails); 
    }else{
      console.log('Form is invalid');
    }
  }

  
getEmplyeeBydesignation(){
  this.managers = [];
  this.service.getEmployeesByDesignation().subscribe({
    next:(res)=>{
      this.managers=res;
      console.log(this.managers);
      
    }
  })
  
}
}
