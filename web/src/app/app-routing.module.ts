import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

import { LoginComponent } from './components/login/login.component';
import { PackagesComponent } from './components/packages/packages.component';
import { RegisterComponent } from './components/register/register.component';
import { PackageEditComponent } from './components/package-edit/package-edit.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

const routes: Routes = [
	{ path: '', redirectTo: 'packages', pathMatch: 'full' },
	{ path: 'register', component: RegisterComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'packages', component: PackagesComponent, canActivate: [AuthGuard] },
	{ path: 'package', component: PackageEditComponent, canActivate: [AuthGuard] },
	{ path: 'package/:id', component: PackageEditComponent, canActivate: [AuthGuard] },
	{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule { }
