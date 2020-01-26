import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

	constructor(
		private http: HttpClient
	) { }

	create(pkg) {
		return this.http.post<any>(`${environment.apiUrl}/packages`, pkg);
	}

	update(packageId, pkg) {
		return this.http.put<any>(`${environment.apiUrl}/packages/${packageId}`, pkg);
	}
	
	getById(packageId) {
		return this.http.get<any>(`${environment.apiUrl}/packages/${packageId}`);
	}

	getAll() {
		return this.http.get<any>(`${environment.apiUrl}/packages`);
	}

	deleteById(packageId) {
		return this.http.delete<any>(`${environment.apiUrl}/packages/${packageId}`);
	}
	
}
