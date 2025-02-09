import { Component, inject, OnInit } from '@angular/core';
import { loadStripe } from '@stripe/stripe-js';
import { Cart } from '../../../../core/models/Cart';
import { CheckoutService } from '../../_services/checkout.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {

  private router = inject(Router);

  private checkoutService = inject(CheckoutService);

  stripe: any;

  cart: Cart[] = []
  sessionId!: string;

  async ngOnInit() {
    this.checkoutService.getCheckout()
      .subscribe({
        next: cart => {
          this.cart = cart.products
          this.sessionId = cart.session_id
        }
      })
    this.stripe = await loadStripe('pk_test_51QnmCmCDlSGWE8W2HV5itNXaFcTfugZuScomYw41ZUtURN9cU7KzunDFuPYMYhVQ1FuinbHEhawkMvIjnqogFP9t008TZINQ1N'); // Replace with your actual Stripe public key
  }

  get totalAmount() {
    return this.cart.reduce((prev, val) => {
      return prev + (val.product.price * val.quantity)
    }, 0)
  }

  async redirectToCheckout() {
    if (!this.stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const { error } = await this.stripe.redirectToCheckout({
      sessionId: this.sessionId,
    });

    if (error) {
      console.error('Stripe checkout error:', error.message);
    }
    else {
      this.router.navigate(['/orders'], {
        replaceUrl: true
      })
    }
  }
}

