import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'typ-root',
	templateUrl: './app.component.html',
	styles: ['./app.component.scss']
})
export class AppComponent {

	constructor(
		private authService: AuthService
	) {
		authService.initUserState();
	}

}
