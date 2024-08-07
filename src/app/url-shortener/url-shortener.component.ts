import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface ShortenResponse {
  short_url: string;
}

interface RedirectResponse {
  original_url: string;
}

@Component({
  selector: 'app-url-shortener',
  templateUrl: './url-shortener.component.html',
  styleUrls: ['./url-shortener.component.css']
})
export class UrlShortenerComponent {
  urlForm: FormGroup;
  shortUrl: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.urlForm = this.fb.group({
      originalUrl: ['', [Validators.required, Validators.pattern(/^(http:\/\/|https:\/\/)(www\.)/)]]
    });
  }
  //implementing http reqs in this file itself instead of a seperate service file
  shortenUrl() {
    if (this.urlForm.valid) {
      const originalUrl = this.urlForm.value.originalUrl;
      //replace backend server, temp hardcoded here
      this.http.post<ShortenResponse>('http://127.0.0.1:5000/shorten', { url: originalUrl })
        .subscribe(
          (response) => {
            this.shortUrl = response.short_url;
          },
          (error) => {
            console.error('Error shortening URL:', error);
          }
        );
    } else {
      console.log('Form is invalid');
    }
  }

  redirectToOrgUrl() {
    if (this.shortUrl) {
      //replace backend server, temp hardcoded here
      this.http.post<RedirectResponse>('http://127.0.0.1:5000/redirect', { url: this.shortUrl })
        .subscribe(
          (response) => {
            window.location.href = response.original_url;
          },
          (error) => {
            console.error('Error redirecting to original URL:', error);
          }
        );
    } else {
      console.log('No short URL available for redirection');
    }
  }
}