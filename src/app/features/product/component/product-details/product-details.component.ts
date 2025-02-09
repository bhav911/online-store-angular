import { Component, inject, input, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Product } from '../../../../core/models/Product';
import { CartService } from '../../../cart/_services/cart.service';
import { Router } from '@angular/router';
import { AddToCartBtnComponent } from "../../../../shared/components/add-to-cart-btn/add-to-cart-btn.component";
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/User';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-product-details',
  imports: [AddToCartBtnComponent],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {

  private productService = inject(ProductService);
  private authService = inject(AuthService);

  backendUrl = environment.backendUrl

  productId = input.required<string>();

  product: Product | null = null
  user: User | null = null;

  ngOnInit(): void {
    this.authService.userValue
      .subscribe(user => {
        this.user = user
      })
    this.productService.getProduct(this.productId())
      .subscribe({
        next: product => {
          this.product = product
        }
      })
  }

}
