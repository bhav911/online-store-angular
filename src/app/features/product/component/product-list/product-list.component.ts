import { Component, inject, input, OnInit } from '@angular/core';
import { ProductService } from '../../_services/product.service';
import { Product } from '../../../../core/models/Product';
import { ProductCardComponent } from "./product-card/product-card.component";
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  imports: [ProductCardComponent, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private productService = inject(ProductService);

  role = input.required<string>();

  products: Product[] = [];
  productCount = 0;
  currentPage = 1;
  productsPerPage = 5;

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      let pageNum = param['page'];
      this.currentPage = pageNum ?? 1
      this.fetchPage(+this.currentPage)
    })
  }

  updateUrlPage(page: number) {
    this.router.navigate([], {
      queryParams: {
        page
      },
      queryParamsHandling: 'merge'
    })
  }

  fetchPage(page: number) {
    this.productService.getProducts(this.role(), page).subscribe({
      next: productData => {
        this.products = productData.products;
        this.productCount = productData.productCount;
      }
    })
  }

  removeProduct(productId: string) {
    let updatedProducts = this.products.filter(prod => prod._id !== productId);
    this.products = updatedProducts;
    if (this.products.length <= 0) {
      this.router.navigate(['/products'], {
        queryParams: {
          page: this.currentPage - 1
        }
      })
    }
  }

  getArrayRange(count: number) {
    return new Array(Math.ceil(count / this.productsPerPage));
  }

}
