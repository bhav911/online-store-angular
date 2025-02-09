import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../_services/cart.service';
import { Cart } from '../../../../core/models/Cart';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {

  private cartService = inject(CartService);

  cart: Cart[] = []

  ngOnInit(): void {
    this.cartService.getCartItems()
      .subscribe({
        next: cart => {
          this.cart = cart
        }
      })
  }

  deleteCartItem(productId: string) {
    this.cartService.deleteCartItem(productId)
      .subscribe({
        next: status => {
          if (status) {
            let updatedCart = this.cart.filter(item => item.product._id !== productId)
            this.cart = updatedCart;
          }
        }
      })
  }
}
