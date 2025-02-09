import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../features/cart/_services/cart.service';

@Component({
  selector: 'app-add-to-cart-btn',
  imports: [],
  templateUrl: './add-to-cart-btn.component.html',
  styleUrl: './add-to-cart-btn.component.css'
})
export class AddToCartBtnComponent {
  private router = inject(Router)

  private cartService = inject(CartService);

  productId = input.required<string>();

  addToCart(productId: string) {
    this.cartService.addProductToCart(productId)
      .subscribe({
        next: status => {
          if (status) {
            this.router.navigate(['/cart'])
          }
        }
      })
  }
}
