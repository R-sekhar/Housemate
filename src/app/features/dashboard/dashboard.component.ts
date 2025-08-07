import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  userEmail = '';
  houseName = '';
  loading = true;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = this.supabase.getCurrentUser();
    if (!user) {
      this.loading = false;
      return;
    }

    this.userEmail = user.email || '';

    // Get the house linked to the user from memberships table
    const { data, error } = await this.supabase.getClient()
      .from('memberships')
      .select('house_id, houses(name)')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching house:', error.message);
      this.houseName = 'Not assigned';
    } else {
      this.houseName = data?.houses?.name || 'Unnamed House';
    }

    this.loading = false;
  }
}
