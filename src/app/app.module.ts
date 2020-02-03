import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { routes, navigatableComponents } from "./app-routing.module";

import { AppComponent } from './app.component';
// import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatGridListModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent,
    navigatableComponents  
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // AngularFontAwesomeModule,
    MatGridListModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
