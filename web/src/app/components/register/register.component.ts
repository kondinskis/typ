import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { finalize } from 'rxjs/operators';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'typ-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

	public userForm: FormGroup;
	public inProgress = false;

	constructor(
		private router: Router,
		private authService: AuthService
	) { }

	ngOnInit() {
		this.userForm = this.initUserForm();
  }

	register(user, valid) {
		if (!valid) { return; }

		this.inProgress = true;

		this.authService.register(user)
			.pipe(finalize(() => this.inProgress = false))
			.subscribe(res => {
				this.authService.setUserState(res.token);
				this.router.navigate(['/packages']);
			}, err => console.error(err));
	}

	private initUserForm(): FormGroup {
		return new FormGroup({
			username: new FormControl(null, Validators.required),
			password: new FormControl(null, Validators.required)
		});
	}
}
