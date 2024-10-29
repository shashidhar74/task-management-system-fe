import { Routes } from '@angular/router';
import { HeaderComponentComponent } from './shared/header-component/header-component.component';
import { ProjectListComponent } from './components/project-list/project-list.component';
import { AuthGuard } from './auth/auth.guard';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';


export const routes: Routes = [
    {path:'projects',component:ProjectListComponent},
    {path:'employees',component:EmployeeListComponent},
    {path:'project-details/:project_name',component:ProjectDetailsComponent}

];
