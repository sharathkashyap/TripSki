import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapScreenComponent } from './components/map-screen/map-screen.component';
import { FiltersComponent } from './components/filters/filters.component';
import { BookingComponent } from './components/booking/booking.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule} from '@angular/material'

@NgModule({
  declarations: [
    AppComponent,
    MapScreenComponent,
    FiltersComponent,
    BookingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
