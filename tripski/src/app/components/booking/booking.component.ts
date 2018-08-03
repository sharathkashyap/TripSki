import { Component, OnInit } from '@angular/core'
import { MatFormFieldModule } from '@angular/material';
import { MatInputModule } from '@angular/material';
import { FormGroup, FormControl } from '@angular/forms'
import { MatGridListModule, MatButtonModule, MatIconModule} from '@angular/material';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  public options2 = [
    {"id": 1, "name": "1"},
    {"id": 2, "name": "2"},
    {"id": 3, "name": "3"},
    {"id": 4, "name": "4"}
  ]
  public selected2 = this.options2[0].id;

  constructor() { }

  ngOnInit() {

     
  }

  

}
