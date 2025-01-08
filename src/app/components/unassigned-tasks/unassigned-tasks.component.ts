import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ServicesService } from '../../services/services.service';
import { TaskDetails } from '../../models/tasks';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-unassigned-tasks',
  standalone: true,
  imports: [MatIcon,CommonModule],
  templateUrl: './unassigned-tasks.component.html',
  styleUrl: './unassigned-tasks.component.css'
})
export class UnassignedTasksComponent {
  username='';
rowData:Array<TaskDetails>=[];
constructor(private service :ServicesService){}

ngOnInit(){
  this.service.username$.subscribe(username => {
    this.username = username;
  });
  this.getTasksData();
}

getTasksData(){
  this.service.getAllTaks().subscribe({
    next : (response)=>{
   this.rowData=response;
    }
  })
  }
}
