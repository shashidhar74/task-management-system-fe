export interface TaskDetails {  
    taskId:String            
    projectName: string;
    taskName: string;
    owner: string;
    status: string;
    priority: Number;
    dueDate: Date;             
    startDate: Date;
    createdOn: Date;
    createdBy: string;
    modifiedOn: Date;
    modifiedBy: string;
}