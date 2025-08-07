import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit, OnDestroy {
  inventory: any[] = [];
  newItemName = '';
  newItemQty = 1;
  houseId = ''; // set this based on your app logic
  private sub: any;

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = this.supabase.getCurrentUser();

    if (!user) return;

    // For now, get the house ID where the user is a member
    const { data: membership } = await this.supabase.getClient()
      .from('memberships')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    this.houseId = membership?.house_id;

    this.fetchInventory();

    // Real-time subscription
    this.sub = this.supabase.getClient()
      .from(`inventory:house_id=eq.${this.houseId}`)
      .on('*', () => this.fetchInventory())
      .subscribe();
  }

  ngOnDestroy() {
    this.supabase.getClient().removeSubscription(this.sub);
  }

  async fetchInventory() {
    const { data } = await this.supabase.getClient()
      .from('inventory')
      .select('*')
      .eq('house_id', this.houseId)
      .order('updated_at', { ascending: false });

    this.inventory = data || [];
  }

  async addItem() {
    const user = this.supabase.getCurrentUser();
    if (!user) return;

    await this.supabase.getClient()
      .from('inventory')
      .insert({
        house_id: this.houseId,
        name: this.newItemName,
        quantity: this.newItemQty,
        updated_by: user.id
      });

    this.newItemName = '';
    this.newItemQty = 1;
  }

  async deleteItem(id: string) {
    await this.supabase.getClient()
      .from('inventory')
      .delete()
      .eq('id', id);
  }
}
