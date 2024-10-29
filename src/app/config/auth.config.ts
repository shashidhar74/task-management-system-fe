import { PassedInitialConfig } from 'angular-auth-oidc-client';


export const authConfig: PassedInitialConfig = {
  config: {
    authority: 'http://localhost:8081/realms/Task-Management-System',
    redirectUrl:'http://localhost:4200/',
    postLogoutRedirectUri:'http://localhost:4200/',
    clientId: 'task-management-system',
    scope: 'openid profile offline_access', 
    responseType: 'code',
    silentRenew: true,
    useRefreshToken: true,
    renewTimeBeforeTokenExpiresInSeconds: 60,
  }
}
