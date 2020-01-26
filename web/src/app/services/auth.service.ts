import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import { JwtHelperService } from '@auth0/angular-jwt';

import { LocalStorageUtil } from '../utils/local-storage.util';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

	public user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	private jwtHelper = new JwtHelperService();

	constructor(
		private router: Router,
		private http: HttpClient,
	) { }

	public initUserState() {
		const token = this.getToken();
		if (token) {
			this.setUserState(token);
		}
	}

	public setUserState(token) {
		if (!this.jwtHelper.isTokenExpired(token)) {
			this.setToken(token);
			this.user.next(this.jwtHelper.decodeToken(token));
		} else {
			this.user.next(null);
		}
	}

	public isTokenExpired() {
		const token = this.getToken();
		if (token) {
			return this.jwtHelper.isTokenExpired(this.getToken())
		}
		return true;
	}

	public logout() {
		LocalStorageUtil.clear();
		this.setUserState(null);
		this.router.navigate(['/login']);
	}

	private setToken(token) {
		LocalStorageUtil.setItem('token', token);
	}

	public getToken() {
		return LocalStorageUtil.getItem('token');
	}

	public login(credentials) {
		return this.http.post<any>(`${environment.apiUrl}/auth/token`, credentials);
	}

	public register(user) {
		return this.http.post<any>(`${environment.apiUrl}/auth/register`, user);
	}

}
