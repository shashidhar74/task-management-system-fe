import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { HeaderComponentComponent } from './shared/header-component/header-component.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HeaderComponentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-management-system';
  private readonly oidcSecurityService = inject(OidcSecurityService);
  ngOnInit(): void {
    this.oidcSecurityService
      .checkAuth()
      .subscribe(({isAuthenticated}) => {
      })
  }
  // private readonly oidcSecurityService = inject(OidcSecurityService);
  // isAuthenticated = false;
  // username = "";
  // ngOnInit(): void {
  //   this.oidcSecurityService.isAuthenticated$.subscribe(
  //     ({isAuthenticated})=>{
  //       this.isAuthenticated=isAuthenticated;
  //       console.log('isAuthenticated',this.isAuthenticated);
  //     }
  //   )
  //   this.oidcSecurityService.userData$.subscribe(
  //     ({userData})=>{
  //       this.username=userData?.name;
  //       console.log('name',this.username);
        
  //     }
  //   )
  // }

  // login(){
  //   this.oidcSecurityService.authorize();
  // }

  // logout(){
  //   this.oidcSecurityService.logoff()
  //   .subscribe;
  // }
}
