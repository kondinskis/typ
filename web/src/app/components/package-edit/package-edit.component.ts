import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { PackageService } from 'src/app/services/package.service';

@Component({
  selector: 'typ-package-edit',
  templateUrl: './package-edit.component.html',
  styleUrls: ['./package-edit.component.scss']
})
export class PackageEditComponent implements OnInit {

	public packageId: number;
	public packageForm: FormGroup;
	public inProgress = false;
	public loadPkgInProgress = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		private packageService: PackageService
	) { }

  ngOnInit() {
		this.activatedRoute.params.subscribe(res => this.packageId = res.id);
		this.packageForm = this.initPackageForm();
		if (this.packageId) {
			this.getById(this.packageId);
		}
	}

	public submit(pkg, valid) {
		if (!valid) { return; }

		this.inProgress = true;

		if (!this.packageId) {
			this.create(pkg)
		} else {
			this.update(this.packageId, pkg);
		}
	}

	private create(pkg) {
		this.packageService.create(pkg)
			.pipe(finalize(() => this.inProgress = false))
			.subscribe(res => {
				this.packageForm.reset();
			}, err => console.error(err));
	}

	private update(pkgId, pkg) {
		this.packageService.update(pkgId, pkg)
			.pipe(finalize(() => this.inProgress = false))
			.subscribe(res => {
				// this.packageForm.reset();
			}, err => console.error(err));
	}

	private getById(pkgId) {
		this.loadPkgInProgress = true;
		this.packageService.getById(pkgId)
			.pipe(finalize(() => this.loadPkgInProgress = false))
			.subscribe(res => {
				this.packageForm.patchValue(res);
			});
	}

	private initPackageForm() {
		return new FormGroup({
			name: new FormControl(null, Validators.required),
			trackingNumber: new FormControl(null, Validators.required)
		});
	}

}
