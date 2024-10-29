export interface TaskDetails {              
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