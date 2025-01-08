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
 
  getCurrentDateTime(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

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

  addEmployees(employee:FormData):Observable<any> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json'
    };
    return this.httpClient.post('http://localhost:9001/api/employee',employee);
  }

  getEmployeesByDesignation(){
    return this.httpClient.get<Array<any>>('http://localhost:9001/api/employee/byDesignation?designation=Manager');
  }

  deleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete(`http://localhost:9001/api/employee/${id}`);
  }

  //Tasks services

  getAllTaks(): Observable<Array<TaskDetails>>{
    return this.httpClient.get<Array<TaskDetails>>('http://localhost:9001/api/task');
  }

  getTasksByProjectName(projectName:any): Observable<Array<TaskDetails>>{
    return this.httpClient.get<Array<TaskDetails>>(`http://localhost:9001/api/task/byProjectName?projectName=${projectName}`);
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
