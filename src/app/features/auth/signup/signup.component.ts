import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from 'src/app/core/supabase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  email = '';
  password = '';
  successMsg = '';
  errorMsg = '';

  constructor(private supabase: SupabaseService, private router: Router) {}

  async signup() {
    const { user, error } = await this.supabase.getClient().auth.signUp({
      email: this.email,
      password: this.password
    });

    if (error) {
      this.errorMsg = error.message;
    } else {
      this.successMsg = 'Check your email to confirm and login!';
    }
  }
}
