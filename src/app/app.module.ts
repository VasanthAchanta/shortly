import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { UrlShortenerComponent } from './url-shortener/url-shortener.component';

// Define your routes
const routes: Routes = [
  { path: 'shorten', component: UrlShortenerComponent },
  { path: '', redirectTo: '/shorten', pathMatch: 'full' },
  // Add other routes here as needed
];

@NgModule({
  declarations: [
    AppComponent,
    UrlShortenerComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes) // Import RouterModule and configure routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }