import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  private router = inject(Router);

  private authService = inject(AuthService);

  user: User | null = null

  ngOnInit(): void {
    this.authService.userValue
      .subscribe(user => {
        this.user = user
      })
  }

  logout() {
    this.authService.logout()
    this.router.navigate(['/products'])
  }
}
