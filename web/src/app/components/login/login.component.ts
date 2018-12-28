import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { finalize } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'typ-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	public credentials: FormGroup;
	public inProgress = false;
	public error: string;

	constructor(
		private router: Router,
		private authService: AuthService
	) { }

	ngOnInit() {
		this.credentials = this.initCredentialsForm();
	}

	login(credentials, valid) {

		if (!valid) { return; }

		this.inProgress = true;
		this.authService.login(credentials)
			.pipe(finalize(() => this.inProgress = false))
			.subscribe(res => {
				this.authService.setUserState(res.token);
				this.router.navigate(['/packages']);
			}, err => this.error = err.error.error);
	}

	private initCredentialsForm() {
		return new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required)
		}, { updateOn: 'submit' });
	}

}
