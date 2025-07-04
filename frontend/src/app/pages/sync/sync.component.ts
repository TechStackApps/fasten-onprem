import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import QRCode from 'qrcode';

@Component({
  selector: 'app-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit {
  qrCodeUrl: SafeUrl = '';
  qrCodeData = '';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    console.log('SyncComponent ngOnInit called');
    const token = localStorage.getItem('token');
    console.log('Token from localStorage:', token);

    this.http.get<any>('/api/secure/sync/initiate', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe(
      (response) => {
        console.log('Sync response:', response);
        if (response.success) {
          this.qrCodeData = JSON.stringify(response.data);
          console.log('Sync initiated:', this.qrCodeData);
          QRCode.toDataURL(this.qrCodeData)
            .then((url) => {
              this.qrCodeUrl = this.sanitizer.bypassSecurityTrustUrl(url);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          console.error('Sync initiation failed:', response);
        }
      },
      (error) => {
        console.error('Error during sync initiation:', error);
      }
    );
  }
}
