import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;

  constructor(private supabase: SupabaseService, private router: Router) {}

  ngOnInit(): void {
    const user = this.supabase.getCurrentUser();
    this.isLoggedIn = !!user;
  }

  async logout() {
    await this.supabase.signOut();
    this.isLoggedIn = false;
    this.router.navigate(['/login']);
  }
}
