import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase.service';

@Component({
  selector: 'app-create-house',
  templateUrl: './create-house.component.html',
  styleUrls: ['./create-house.component.scss']
})
export class CreateHouseComponent {
  houseName = '';
  successMsg = '';
  errorMsg = '';

  constructor(private supabase: SupabaseService) {}

  async createHouse() {
    const user = this.supabase.getCurrentUser();

    if (!user) {
      this.errorMsg = 'User not logged in';
      return;
    }

    // Step 1: Insert into houses
    const { data: houseData, error: houseError } = await this.supabase.getClient()
      .from('houses')
      .insert({
        name: this.houseName,
        created_by: user.id
      })
      .single();

    if (houseError) {
      this.errorMsg = houseError.message;
      return;
    }

    // Step 2: Add membership for user as admin
    const { error: membershipError } = await this.supabase.getClient()
      .from('memberships')
      .insert({
        house_id: houseData.id,
        user_id: user.id,
        role: 'admin'
      });

    if (membershipError) {
      this.errorMsg = membershipError.message;
    } else {
      this.successMsg = 'House created and you are the admin 🎉';
      this.houseName = '';
    }
  }
}
