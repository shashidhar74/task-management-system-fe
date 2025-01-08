import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import {AuthModule, OidcSecurityService} from "angular-auth-oidc-client"; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ServicesService } from '../../services/services.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
//import { HomePageComponent } from '../../pages/home-page/home-page/home-page.component';

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [AuthModule,NgbModule,MatIconModule,MatListModule,MatExpansionModule,MatButtonModule,MatMenuModule,RouterModule,MatSidenavModule],
  providers:[OidcSecurityService,HttpClient],
  templateUrl: './header-component.component.html',
  styleUrl: './header-component.component.css'
})
export class HeaderComponentComponent implements OnInit{
  constructor(private service :ServicesService){}
 private  oidcSecurityService = inject(OidcSecurityService);
  isAuthenticated = false;
  username = "";
  projectNames:any=[];
  userRoles: any[] = [];
  userInitials: string | undefined;
  ngOnInit(): void {
    this.oidcSecurityService.isAuthenticated$.subscribe(
      ({isAuthenticated})=>{
        this.isAuthenticated=isAuthenticated;
        this.getProjectsData();
        this.getUserRoles();
      }
    )
    this.oidcSecurityService.userData$.subscribe(
      ({userData})=>{
        this.username=userData?.name;
        this.userInitials = this.getInitials(this.username);
        this.service.setUsername(this.username);
      }
    )
  }

  getInitials(name: string | undefined): string {
    if (!name) return '';
    const parts = name.split(' ');
    const initials = parts.map(part => part.charAt(0).toUpperCase()).join('');
    return initials;
  }

  login(){
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff().subscribe({
      next: () => {},});
  }
  
  getProjectsData(){
    this.projectNames=[];
    this.service.getAllProjectsData().subscribe({
      next : (response)=>{
     this.projectNames=response;
      }
    })
    }
    getUserRoles(): any {
      this.oidcSecurityService.getAccessToken().subscribe(token => {
        if (token) {
          const payload = this.getPayload(token);
          this.userRoles = payload?.realm_access?.roles || [];
        } else {
          this.userRoles = [];
        }
      });
    }
    private getPayload(token: string): any {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    }
    
}
