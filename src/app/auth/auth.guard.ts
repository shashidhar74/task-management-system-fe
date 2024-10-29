import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { map, take } from 'rxjs';

export class AuthGuard implements CanActivate {
  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {}

  canActivate() {
    return this.oidcSecurityService.isAuthenticated$.pipe(
      take(1), // Take the first emission
      map(({ isAuthenticated }) => {
        if (!isAuthenticated) {
          this.router.navigate(['/']); // Redirect to home or login page if not authenticated
        }
        return isAuthenticated; // Allow or deny access based on authentication status
      })
    );
  }
}
