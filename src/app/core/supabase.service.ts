import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient(
      'https://wigffffhwlynjeusmfgb.supabase.co', // ✅ your project URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpZ2ZmZmZod2x5bmpldXNtZmdiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1MjE4NzAsImV4cCI6MjA3MDA5Nzg3MH0.zoIa5FyATTjgbkf7p55fhJtAiqBpE9LD6S3B22gxntE'   // ✅ your anon public key
    );

    // ✅ Load user if already logged in
    const currentUser = this.supabase.auth.user();
    this.userSubject.next(currentUser);
  }

  // 🔔 Observable for components (navbar, guards, etc.)
  get user$() {
    return this.userSubject.asObservable();
  }

  getCurrentUser(): User | null {
    return this.userSubject.value;
  }

  // ✅ Signup
  async signUp(email: string, password: string) {
    const { user, error } = await this.supabase.auth.signUp({ email, password });
    if (user) this.userSubject.next(user);
    return { user, error };
  }

  // ✅ Login
  async signIn(email: string, password: string) {
    const { user, error } = await this.supabase.auth.signIn({ email, password });
    if (user) this.userSubject.next(user);
    return { user, error };
  }

  // ✅ Logout
  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    this.userSubject.next(null);
    return { error };
  }

  getClient() {
    return this.supabase;
  }
}
