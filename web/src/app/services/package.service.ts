import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PackageService {

	constructor(
		private http: HttpClient
	) { }

	create(pkg) {
		return this.http.post<any>(`http://localhost:5000/api/packages`, pkg);
	}

	update(packageId, pkg) {
		return this.http.put<any>(`http://localhost:5000/api/packages/${packageId}`, pkg);
	}
	
	getById(packageId) {
		return this.http.get<any>(`http://localhost:5000/api/packages/${packageId}`);
	}

	getAll() {
		return this.http.get<any>(`http://localhost:5000/api/packages`);
	}

	deleteById(packageId) {
		return this.http.delete<any>(`http://localhost:5000/api/packages/${packageId}`);
	}
	
}
