import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'typ-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit, OnDestroy {

	public collapsedNav = false;
	public user: any;
	private unsubscribe: Subject<void> = new Subject();

	constructor(
		private router: Router,
		public authService: AuthService
	) { }

  ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.collapsedNav = false;
			}
		});

		this.authService.user
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(res => this.user = res);
	}

	ngOnDestroy() {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

}
