import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async login() {
    const { user, error } = await this.supabase.signIn(this.email, this.password);

    if (error) {
      this.errorMsg = error.message;
    } else if (user) {
      // ✅ First go to home
      await this.router.navigate(['/']);

      // ✅ Then refresh the page
      window.location.reload();
    }
  }
}
