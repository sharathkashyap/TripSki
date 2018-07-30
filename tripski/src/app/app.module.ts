import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapScreenComponent } from './components/map-screen/map-screen.component';
import { FiltersComponent } from './components/filters/filters.component';
import { BookingComponent } from './components/booking/booking.component';

@NgModule({
  declarations: [
    AppComponent,
    MapScreenComponent,
    FiltersComponent,
    BookingComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot(),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
