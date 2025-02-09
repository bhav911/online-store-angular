import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { Product } from '../../../../../core/models/Product';
import { RouterLink } from '@angular/router';
import { AddToCartBtnComponent } from "../../../../../shared/components/add-to-cart-btn/add-to-cart-btn.component";
import { ProductService } from '../../../_services/product.service';
import { AuthService } from '../../../../../core/services/auth.service';
import { User } from '../../../../../core/models/User';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-product-card',
  imports: [RouterLink, AddToCartBtnComponent],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  private productService = inject(ProductService)
  private authService = inject(AuthService);

  backendUrl = environment.backendUrl;

  @Output() delete = new EventEmitter();
  product = input.required<Product>();
  role = input.required<string>();

  user: User | null = null;

  ngOnInit(): void {
    this.authService.userValue
      .subscribe(user => {
        this.user = user
      })
  }

  deleteProduct() {
    this.productService.deleteProduct(this.product()._id!)
      .subscribe({
        next: status => {
          if (status) {
            this.delete.emit(true);
          }
        }
      })
  }
}
