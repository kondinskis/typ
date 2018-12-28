import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { finalize } from 'rxjs/operators';

import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'typ-package-view',
  templateUrl: './package-view.component.html',
  styleUrls: ['./package-view.component.scss']
})
export class PackageViewComponent implements OnInit {

	@Input() public pkg: any;
	@Output() public deleted = new EventEmitter<any>();
	public deleteInProgress = false;
	public details = null;
	public detailsInProgress = false;
	public error: string;
	

	constructor(
		private packageService: PackageService
	) { }

  ngOnInit() {
	}

	public getById(id) {
		this.detailsInProgress = true;
		this.packageService.getById(id)
			.pipe(finalize(() => this.detailsInProgress = false))
			.subscribe(res => {
				this.details = res.tracking_details;
			}, err => this.error = err.error.message);
	}

	public deleteById(pkgId) {
		this.deleteInProgress = true;
		this.packageService.deleteById(pkgId)
			.pipe(finalize(() => this.deleteInProgress = false))
			.subscribe(res => {
				this.deleted.emit(pkgId);
			}, err => console.error(err));
	}

}
