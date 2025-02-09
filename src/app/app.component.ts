import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./core/components/header/header.component";
import { AuthService } from './core/services/auth.service';
import { CsrfService } from './core/services/csrf.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'online_store';
  private csrfService = inject(CsrfService);
  private authService = inject(AuthService);
  loaded = true;

  ngOnInit(): void {
    this.authService.userValue
      .subscribe(() => {
          this.loaded = true;
        // this.csrfService.fetchCsrfToken().subscribe(() => {
        // })
      })
  }
}
