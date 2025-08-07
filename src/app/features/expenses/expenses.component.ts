import { Component, OnInit } from '@angular/core';
import { SupabaseService } from 'src/app/core/supabase.service';
import emailjs from 'emailjs-com';
import { FormsModule } from '@angular/forms';


FormsModule

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {
  description = '';
  amount = 0;
  file: File | null = null;
  houseId = '';
  expenses: any[] = [];
  successMsg = '';
  errorMsg: string | undefined;
 

  constructor(private supabase: SupabaseService) {}

  async ngOnInit() {
    const user = this.supabase.getCurrentUser();
    if (!user) return;

    // Get user's house
    const { data: membership } = await this.supabase.getClient()
      .from('memberships')
      .select('house_id')
      .eq('user_id', user.id)
      .single();

    this.houseId = membership?.house_id;

    await this.fetchExpenses();
  }

  async fetchExpenses() {
    const { data } = await this.supabase.getClient()
      .from('expenses')
      .select('*')
      .eq('house_id', this.houseId)
      .order('created_at', { ascending: false });

    this.expenses = data || [];
  }

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (!input.files || input.files.length === 0) return;

  this.file = input.files[0];
}



  async addExpense() {
    const user = this.supabase.getCurrentUser();
    if (!user) return;

    let receiptUrl = null;

    // Upload receipt if present
    if (this.file) {
      const filePath = `${this.houseId}/${Date.now()}-${this.file.name}`;
      const { error: uploadError } = await this.supabase.getClient()
        .storage.from('receipts')
        .upload(filePath, this.file);

      if (!uploadError) {
        const { publicURL } = this.supabase.getClient()
          .storage.from('receipts')
          .getPublicUrl(filePath);
        receiptUrl = publicURL;
      }
    }

    // Add to expenses
    const { error } = await this.supabase.getClient()
      .from('expenses')
      .insert({
        house_id: this.houseId,
        description: this.description,
        amount: this.amount,
        paid_by: user.id,
        receipt_url: receiptUrl
      });

    if (!this.houseId) {
  this.errorMsg = 'House not loaded. Please refresh.';
  return;
}

await this.supabase.getClient()
  .from('expenses')
  .insert({
    house_id: this.houseId,
    description: this.description,
    amount: this.amount,
    paid_by: user.id,
    receipt_url: receiptUrl
  });

  }

  sendEmail(email: string) {
    emailjs.send(
      'YOUR_SERVICE_ID',
      'YOUR_TEMPLATE_ID',
      {
        to_email: email,
        message: 'A new house expense was added!'
      },
      'YOUR_USER_ID'
    ).then(() => {
      console.log('Email sent');
    });
  }
}
