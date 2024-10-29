import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Project } from '../models/projectdetails';
import { BehaviorSubject, Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { TaskDetails } from '../models/tasks';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor(private httpClient: HttpClient) { }
  private usernameSource = new BehaviorSubject<string>('');
  username$ = this.usernameSource.asObservable();
 
  setUsername(username: string) {
    this.usernameSource.next(username);
  }
  getUsername(){

  }

  
 // Projects Services 

  getAllProjectsData(): Observable<Array<Project>>{
    return this.httpClient.get<Array<Project>>('http://localhost:9001/api/projectDetails');
  }
 
  addNewProject(Project:Project):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    return this.httpClient.post('http://localhost:9001/api/projectDetails',Project,httpOptions);
  }

   // Employee Services 

    getAllEmployeeData(): Observable<Array<Employee>>{
    return this.httpClient.get<Array<Employee>>('http://localhost:9001/api/employee');
  }

  addEmployees(employee:Employee):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    return this.httpClient.post('http://localhost:9001/api/employee',employee,httpOptions);
  }

  getEmployeesByDesignation(){
    return this.httpClient.get<Array<any>>('http://localhost:9001/api/employee/byDesignation?designation=Manager');
  }


  //Tasks services

  getAllTaks(): Observable<Array<TaskDetails>>{
    return this.httpClient.get<Array<TaskDetails>>('http://localhost:9001/api/task');
  }

  addNewTask(TaskDetails:TaskDetails[]):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    return this.httpClient.post('http://localhost:9001/api/task',TaskDetails,httpOptions);
  }
}
