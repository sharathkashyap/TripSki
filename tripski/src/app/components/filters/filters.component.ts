import { Component, OnInit } from '@angular/core';
import { MatGridListModule, MatButtonModule, MatIconModule} from '@angular/material';

@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss']
})
export class FiltersComponent implements OnInit {
  evtName : any;

  constructor() { }
  filterCall(evt):any{
    this.evtName =evt;
    console.log(evt);
  }
  ngOnInit() {
  }

}
