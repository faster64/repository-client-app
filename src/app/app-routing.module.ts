import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FirstCheckComponent } from './shared/components/first-check.component';
import { Routing } from './shared/constants/common.constant';
import { BaseGuard } from './shared/guards/base.guard';
import { SignInUpGuard } from './shared/guards/sign-in-up.guard';
import { BaseResolver } from './shared/resolvers/base.resolver';
const routes: Routes = [
  {
    path: '',
    component: FirstCheckComponent,
  },
  {
    path: Routing.ACCESS_DENIED.path,
    loadChildren: () => import('./shared/components/aws-access-denied/access-denied.module').then(m => m.AccessDeniedModule),
    resolve: {
      resolver: BaseResolver,
    },
    data: {
      title: Routing.ACCESS_DENIED.name,
    }
  },
  {
    path: Routing.NOT_FOUND.path,
    loadChildren: () => import('./shared/components/aws-not-found/aws-not-found.module').then(m => m.AwsNotFoundModule),
    resolve: {
      resolver: BaseResolver,
    },
    runGuardsAndResolvers: 'always',
    data: {
      title: Routing.NOT_FOUND.name,
    }
  },
  {
    path: Routing.REGISTER.path,
    loadChildren: () => import('./authentication/components/register-v2/register-v2.module').then(m => m.RegisterV2Module),
    canActivate: [SignInUpGuard],
    resolve: {
      resolver: BaseResolver,
    },
    data: {
      title: Routing.REGISTER.name,
    }
  },
  {
    path: Routing.LOGIN.path,
    loadChildren: () => import('./authentication/components/login/login.module').then(m => m.LoginModule),
    canActivate: [SignInUpGuard],
    resolve: {
      resolver: BaseResolver,
    },
    data: {
      title: Routing.LOGIN.name,
    }
  },
  {
    path: Routing.LOGOUT.path,
    loadChildren: () => import('./authentication/components/logout/logout.module').then(m => m.LogoutModule),
    data: {
      title: Routing.LOGOUT.name,
    }
  },
  {
    path: Routing.VERIFY_LOGIN.path,
    loadChildren: () => import('./authentication/components/login-verification/login-verification.module').then(m => m.LoginVerificationModule),
    canActivate: [SignInUpGuard],
    resolve: {
      resolver: BaseResolver,
    },
    data: {
      title: Routing.VERIFY_LOGIN.name,
    }
  },
  {
    path: Routing.REPOSITORY.path,
    loadChildren: () => import('./components/repository/repository.module').then(m => m.RepositoryModule),
    canActivate: [BaseGuard],
    resolve: {
      resolver: BaseResolver,
    },
    data: {
      title: Routing.REPOSITORY.name,
    }
  },
  {
    path: "**",
    redirectTo: `/${Routing.NOT_FOUND.path}`,
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
