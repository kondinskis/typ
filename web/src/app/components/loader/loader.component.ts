import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'typ-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

	@Input() public active: boolean;
	@Input() public fullscreen: boolean;

  constructor() { }

  ngOnInit() {
  }

}
