import { Component, OnInit } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'typ-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

	public packages: any[] = [];
	public inProgress = false;

	constructor(
		private packageService: PackageService
	) { }

  ngOnInit() {
		this.getPackages();
  }

	private getPackages() {
		this.inProgress = true;
		this.packageService.getAll()
			.pipe(finalize(() => this.inProgress = false))
			.subscribe(res => {
				this.packages = res;
			}, err => console.error(err));
	}

	public deletePackage(pkgId) {
		const index = this.packages.indexOf(pkg => pkg.id === pkgId);
		this.packages.splice(index, 1);
	}

	public pkgId(index, pkg) {
		return pkg.id;
	}

}
