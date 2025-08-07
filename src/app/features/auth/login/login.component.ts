import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMsg = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async login() {
    const { error } = await this.supabase.signIn(this.email, this.password);
    if (error) {
      this.errorMsg = error.message;
    } else {
      this.router.navigate(['/']);
    }
  }
}
